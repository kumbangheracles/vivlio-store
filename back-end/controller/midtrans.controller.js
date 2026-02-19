const Midtrans = require("midtrans-client");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const userPurchases = require("../models/userPurchases");
const { BookStats, Book, UserCart } = require("../models/index");
const axios = require("axios");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const { generateId } = require("../utils/generateId");
let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
  async midtransWebhook(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        order_id,
        status_code,
        gross_amount,
        signature_key,
        transaction_status,
        fraud_status,
      } = req.body;

      const serverKey = process.env.MIDTRANS_SERVER_KEY;

      const hash = crypto
        .createHash("sha512")
        .update(order_id + status_code + gross_amount + serverKey)
        .digest("hex");

      if (hash !== signature_key) {
        return res.status(403).json({
          message: "Invalid signature",
        });
      }

      const purchases = await userPurchases.findAll({
        where: {
          [Op.or]: [{ orderGroupId: order_id }, { orderId: order_id }],
        },
        transaction: t,
        lock: true,
      });

      // console.log("Finded Purchase: ", purchases);

      if (purchases.length === 0) {
        await t.rollback();
        return res.status(404).json({
          message: "Order not found",
        });
      }

      if (purchases.every((p) => p.paymentStatus === "PAID")) {
        await t.commit();
        return res.status(200).json({ message: "Already processed" });
      }
      if (transaction_status === "expire") {
        for (const purchase of purchases) {
          await purchase.update(
            { paymentStatus: "CANCELLED" },
            { transaction: t },
          );
          await UserCart.destroy({
            where: {
              userId: purchase.userId,
              bookId: purchase.bookId,
            },
            transaction: t,
          });
        }

        console.log(
          "Transaction status now =============================== : ",
          transaction_status,
        );

        await t.commit();
        return res.status(200).json({
          message: "Payment expired and canceled",
        });
      }

      if (
        transaction_status === "settlement" ||
        (transaction_status === "capture" && fraud_status === "accept")
      ) {
        for (const purchase of purchases) {
          // update payment status
          await purchase.update({ paymentStatus: "PAID" }, { transaction: t });

          const book = await Book.findByPk(purchase.bookId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          if (!book) {
            await t.rollback();
            return res.status(404).json({
              message: "Book not found",
            });
          }

          if (book.quantity < purchase.quantity) {
            await t.rollback();
            return res.status(403).json({
              message: "Stock not enough",
            });
          }

          // kurangi stock
          await book.update(
            { quantity: book.quantity - purchase.quantity },
            { transaction: t },
          );

          // hapus dari cart
          await UserCart.destroy({
            where: {
              userId: purchase.userId,
              bookId: purchase.bookId,
            },
            transaction: t,
          });
        }
      }

      await t.commit();

      return res.status(200).json({
        message: "Webhook processed",
      });
    } catch (error) {
      await t.rollback();
      console.error("WEBHOOK ERROR:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async midtransPost(req, res) {
    try {
      const { id, productName, price, quantity } = req.body;
      const order_id = uuidv4();
      const qty = Number(quantity) || 1;
      const unitPrice = Number(price) || 0;
      const total = unitPrice * qty;

      let parameter = {
        transaction_details: {
          order_id,
          gross_amount: total,
        },
        item_details: [
          {
            id: id,
            name: productName,
            price: unitPrice,
            quantity: qty,
          },
        ],
        expiry: {
          unit: "minute",
          duration: 1,
        },
        callbacks: {
          finish: `${process.env.REDIRECT_URL_MIDTRANS}?status=success`,
          error: `${process.env.REDIRECT_URL_MIDTRANS}?status=failed`,
          pending: `${process.env.REDIRECT_URL_MIDTRANS}?status=pending`,
        },
      };

      const transaction = await snap.createTransaction(parameter);

      if (transaction) {
        await userPurchases.create({
          id: order_id,
          bookId: id,
          userId: req.id,
          quantity: quantity,
          priceAtPurchases: price,
          midtransToken: transaction.token,
          paymentStatus: "PENDING",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Success",
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      });
    } catch (error) {
      console.error("Midtrans Error: ", error);
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        token: null,
      });
    }
  },

  async midtransMultiCheckout(req, res) {
    try {
      const { books } = req.body;
      const order_id = uuidv4();
      const grossAmount = books.reduce(
        (acc, item) => acc + item?.price * item?.UserCart?.quantity,
        0,
      );

      let parameter = {
        transaction_details: {
          order_id,
          gross_amount: grossAmount,
        },
        item_details: books.map((item) => ({
          id: item?.id,
          name: item?.title,
          price: Number(item?.price),
          quantity: Number(item?.UserCart?.quantity),
        })),
        expiry: {
          unit: "minute",
          duration: 1,
        },
        callbacks: {
          finish: `${process.env.REDIRECT_URL_MIDTRANS}?status=success`,
          error: `${process.env.REDIRECT_URL_MIDTRANS}?status=failed`,
          pending: `${process.env.REDIRECT_URL_MIDTRANS}?status=pending`,
        },
      };

      const transaction = await snap.createTransaction(parameter);
      if (transaction) {
        const purchaseRows = books.map((item) => ({
          orderGroupId: order_id,
          bookId: item.id,
          userId: req.id,
          quantity: Number(item.UserCart.quantity),
          priceAtPurchases: Number(item.price),
          midtransToken: transaction.token,
          paymentStatus: "PENDING",
          order_number: generateId(),
        }));

        await userPurchases.bulkCreate(purchaseRows);
      }

      res.status(200).json({
        status: 200,
        message: "Success",
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      });
    } catch (error) {
      console.error("Midtrans Error: ", error);
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        token: null,
      });
    }
  },
  async cancelPayment(req, res) {
    const t = await sequelize.transaction();
    try {
      const { orderGroupId } = req.body;
      console.log("Order Id: ", orderGroupId);
      if (!orderGroupId)
        return res.status(403).json({
          message: "Order Id Not Found",
        });

      const response = await axios.post(
        `https://api.sandbox.midtrans.com/v2/${orderGroupId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              process.env.MIDTRANS_SERVER_KEY + ":",
            ).toString("base64")}`,
          },
        },
      );
      const userPurchase = await userPurchases.findOne({
        where: { orderGroupId },
        transaction: t,
        lock: true,
      });
      if (!userPurchase) {
        await t.rollback();
        return res.status(404).json({
          message: "Purchase not found",
        });
      }
      await userPurchase.update(
        { paymentStatus: "CANCELLED" },
        { transaction: t },
      );

      await UserCart.destroy({
        where: {
          userId: userPurchase.userId,
          bookId: userPurchase.bookId,
        },
        transaction: t,
      });

      await t.commit(); // ✅ WAJIB

      return res.status(200).json({
        message: "Payment cancelled",
        result: response.data,
      });
    } catch (error) {
      await t.rollback(); // ✅ WAJIB
      console.error(error);
      return res.status(500).json({
        message: "Cancel failed",
      });
    }
  },

  async getMidtransOrderDetail(req, res) {
    try {
      const { orderId } = req.params;
      if (!orderId)
        return res.status(403).json({
          message: "Order Id Not Found",
        });
      const response = await axios.get(
        `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              process.env.MIDTRANS_SERVER_KEY + ":",
            ).toString("base64")}`,
          },
        },
      );

      return res.status(200).json({
        message: "Success",
        result: { ...response.data },
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      return res.status(500).json({
        message: "Failed to fetch transaction",
      });
    }
  },
};

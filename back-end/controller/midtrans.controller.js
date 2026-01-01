const Midtrans = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");
let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
  async midtransPost(req, res) {
    try {
      const { id, productName, price, quantity } = req.body;

      const qty = Number(quantity) || 1;
      const unitPrice = Number(price) || 0;
      const total = unitPrice * qty;

      let parameter = {
        transaction_details: {
          order_id: id,
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
      };

      const transaction = await snap.createTransaction(parameter);

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

      const grossAmount = books.reduce(
        (acc, item) => acc + item?.price * item?.UserCart?.quantity,
        0
      );

      let parameter = {
        transaction_details: {
          order_id: uuidv4(),
          gross_amount: grossAmount,
        },
        item_details: books.map((item) => ({
          id: item?.id,
          name: item?.title,
          price: Number(item?.price),
          quantity: Number(item?.UserCart?.quantity),
        })),
      };

      const transaction = await snap.createTransaction(parameter);

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
};

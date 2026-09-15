const {
  UserWishlist,
  Book,
  BookStats,
  BookImage,
  Genre,
} = require("../models/index");
const { updateBookPopularity } = require("../helpers/updatePopularityBook");
const redisClient = require("../utils/redisClient");

// HELPER FUNGSIONAL: Untuk menghapus cache wishlist & buku milik user tertentu
async function clearWishlistCache(userId) {
  try {
    // 1. Hapus cache halaman Wishlist khusus user ini
    const wishlistKeys = await redisClient.keys(`wishlist:user:${userId}:*`);
    if (wishlistKeys.length > 0) {
      await redisClient.del(wishlistKeys);
      console.log(`=== CACHE WISHLIST DI-CLEAR untuk User ID: ${userId} ===`);
    }

    // 2. Hapus cache halaman Buku utama yang memuat status wishlist user ini
    const bookKeys = await redisClient.keys(`books:getAll:*:user:${userId}`);
    if (bookKeys.length > 0) {
      await redisClient.del(bookKeys);
      console.log(
        `=== CACHE BOOKS:GETALL DI-CLEAR untuk User ID: ${userId} ===`,
      );
    }
  } catch (redisErr) {
    console.error("Gagal membersihkan cache Redis:", redisErr);
  }
}

module.exports = {
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.id;
      const book = await Book.findOne({
        where: { id },
        include: [
          { model: BookStats, as: "stats" },
          { model: BookImage, as: "images" },
          { model: Genre, as: "genres", through: { attributes: [] } },
        ],
      });

      if (!book) {
        return res.status(404).json({
          status: 404,
          message: "Book not found",
        });
      }

      let isWishlisted = false;
      if (userId) {
        const exist = await UserWishlist.findOne({
          where: { userId, bookId: id },
        });
        isWishlisted = !!exist;
      }

      res.status(200).json({
        status: 200,
        message: "Success",
        result: {
          ...book.toJSON(),
          isWishlisted,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
      });
    }
  },
  async getAllWishlist(req, res) {
    const pageWish = parseInt(req.query.pageWish) || 1;
    const limitWish = parseInt(req.query.limitWish) || 10;
    const sortPrice = parseInt(req.query.sortPrice) || 0;
    const sortDate = req.query.sortDate || "";
    const offset = (pageWish - 1) * limitWish;

    try {
      const userId = req.id;

      // ==========================================
      // 1. MEMBUAT CACHE KEY KHUSUS USER
      // ==========================================
      // Struktur key: wishlist:user:[userId]:[kombinasi query filter]
      const cacheKey = `wishlist:user:${userId}:${JSON.stringify(req.query)}`;

      // ==========================================
      // 2. CEK CACHE DI REDIS
      // ==========================================
      const cachedWishlist = await redisClient.get(cacheKey);
      if (cachedWishlist) {
        console.log(
          `=== WISHLIST DIAMBIL DARI REDIS CACHE (User: ${userId}) ===`,
        );
        return res.status(200).json(JSON.parse(cachedWishlist));
      }

      console.log("=== CACHE MISS: DIAMBIL DARI DATABASE WISHLIST ===");

      const order = [];
      if (sortPrice === 1) {
        order.push([{ model: Book, as: "book" }, "price", "ASC"]);
      } else if (sortPrice === -1) {
        order.push([{ model: Book, as: "book" }, "price", "DESC"]);
      } else if (sortDate === "newest_saved") {
        order.push(["createdAt", "DESC"]);
      } else if (sortDate === "oldest_saved") {
        order.push(["createdAt", "ASC"]);
      }

      const { count, rows } = await UserWishlist.findAndCountAll({
        where: { userId },
        limit: limitWish,
        offset,
        distinct: true,
        order: order,
        include: [
          {
            model: Book,
            as: "book",
            include: [
              { model: BookStats, as: "stats" },
              { model: BookImage, as: "images" },
              { model: Genre, as: "genres", through: { attributes: [] } },
            ],
          },
        ],
      });

      // Format data response
      const responseData = {
        status: 200,
        message: "Success",
        results: rows,
        total: count,
        currentPage: parseInt(pageWish),
        totalPages: Math.ceil(count / limitWish),
      };

      // ==========================================
      // 3. SIMPAN HASIL KE REDIS (TTL: 5 Menit)
      // ==========================================
      await redisClient.set(cacheKey, JSON.stringify(responseData), {
        EX: 300, // Kedaluwarsa dalam 300 detik
      });

      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  // async getAllWishlist(req, res) {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     status,
  //     sortBy = "createdAt",
  //     sortOrder = "DESC",
  //   } = req.query;

  //   const offset = (page - 1) * limit;
  //   const where = {};
  //   if (status) {
  //     where.status = status;
  //   }

  //   const order = [[sortBy, sortOrder.toUpperCase()]];
  //   try {
  //     const userId = req.id;

  //     const { count, rows } = await UserWishlist.findAll({
  //       where: { userId },
  //       order,
  //       include: [
  //         {
  //           model: Book,
  //           where: where,
  //           as: "book",
  //           include: [
  //             { model: BookStats, as: "stats" },
  //             { model: BookImage, as: "images" },
  //             { model: Genre, as: "genres", through: { attributes: [] } },
  //           ],
  //         },
  //         offset,
  //       ],
  //     });

  //     res.status(200).json({
  //       status: 200,
  //       message: "Success",
  //       results: rows,
  //       total: count,
  //       currentPage: parseInt(page),
  //       totalPages: Math.ceil(count / limit),
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: 500,
  //       message: error.message || "Internal server error",
  //       data: [],
  //     });
  //   }
  // },

  // Pastikan redisClient sudah di-import di bagian atas file
  // const redisClient = require('../path/to/redisClient');

  async addToWishlist(req, res) {
    try {
      const userId = req.id;
      const { bookId } = req.body;

      const exist = await UserWishlist.findOne({ where: { userId, bookId } });
      if (exist) {
        return res
          .status(400)
          .json({ status: 400, message: "Book already in wishlist" });
      }

      await UserWishlist.create({ userId, bookId });
      await updateBookPopularity(bookId);

      // ==========================================
      // AKSI REDIS: Bersihkan cache karena data berubah
      // ==========================================
      await clearWishlistCache(userId);

      res.status(200).json({
        status: 200,
        message: "Success Add to wishlist",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async removeFromWishlist(req, res) {
    try {
      const userId = req.id;
      const { bookId } = req.params;

      const deleted = await UserWishlist.destroy({ where: { userId, bookId } });
      if (!deleted) {
        return res
          .status(404)
          .json({ status: 404, message: "Book not found in wishlist" });
      }

      // ==========================================
      // AKSI REDIS: Bersihkan cache karena data berubah
      // ==========================================
      await clearWishlistCache(userId);

      res.status(200).json({
        status: 200,
        message: "Removed from wishlist success",
      });
    } catch (error) {
      // Perbaikan typo 'errror' dari kode asli Anda
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async toggleWishlist(req, res) {
    try {
      const userId = req.id;
      const { bookId } = req.body;

      const exist = await UserWishlist.findOne({ where: { userId, bookId } });

      if (exist) {
        await UserWishlist.destroy({ where: { userId, bookId } });

        // ==========================================
        // AKSI REDIS: Bersihkan cache (Mode Hapus)
        // ==========================================
        await clearWishlistCache(userId);

        return res.status(200).json({
          status: 200,
          message: "Removed from wishlist",
          isWishlisted: false,
        });
      }

      await UserWishlist.create({ userId, bookId });

      // ==========================================
      // AKSI REDIS: Bersihkan cache (Mode Tambah)
      // ==========================================
      await clearWishlistCache(userId);

      res.status(200).json({
        status: 200,
        message: "Added to wishlist",
        isWishlisted: true,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
      });
    }
  },
};

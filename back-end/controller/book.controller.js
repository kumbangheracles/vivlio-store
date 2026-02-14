const {
  Book,
  BookImage,
  Genre,
  User,
  BookStats,
  UserWishlist,
  UserCart,
  UserImage,
  BookReview,
} = require("../models/index");
// const Book = require("../models/books");
// const BookImage = require("../models/bookImage");
// const Genre = require("../models/genre");
const { sequelize } = require("../config/database");
const { Op, or } = require("sequelize");
const { deleteFromCloudinary } = require("../helpers/deleteCoudinary");

module.exports = {
  async getAllCommon(req, res) {
    const {
      isPopular,
      title,
      categoryId,
      genreId,
      page = 1,
      status,
      limit,
      sortPrice,
      sortDate,
      isRecomend,
      onlyAvailable,
    } = req.query || {};
    const parsedLimit = limit ? parseInt(limit) : null;
    const parsedSortPrice = parseInt(sortPrice);
    console.log("onlyAvailble:", onlyAvailable);
    console.log("Full query:", req.query);

    const filters = {};
    if (isRecomend) {
      filters.isRecomend = true;
    }
    if (onlyAvailable === "true") {
      filters.quantity = {
        [Op.gt]: 0,
      };
    }
    if (isPopular !== undefined) {
      filters.isPopular = isPopular === "true" || isPopular === "1";
    }
    if (categoryId) filters.categoryId = categoryId;

    if (title) {
      filters.title = { [Op.like]: `%${title}%` };
    }
    if (status) {
      filters.status = status;
    }
    const offset = (page - 1) * parsedLimit;

    console.log("Limit common: ", parsedLimit);
    console.log("isPopular Common: ", isPopular);
    try {
      const total = await Book.count({
        where: filters,
        include: [
          ...(genreId
            ? [
                {
                  model: Genre,
                  as: "genres",
                  where: { genreid: genreId },
                  required: true,
                  through: { attributes: [] },
                },
              ]
            : []),
        ],
      });

      const order = [];

      if (parsedSortPrice) {
        order.push(["price", parsedSortPrice === 1 ? "ASC" : "DESC"]);
      }

      if (sortDate === "newest_saved") {
        order.push(["createdAt", "DESC"]);
      }

      if (sortDate === "oldest_saved") {
        order.push(["createdAt", "ASC"]);
      }

      if (isPopular) {
        order.push([{ model: BookStats, as: "stats" }, "views", "DESC"]);
      }
      console.log("order:", order);
      const rows = await Book.findAll({
        limit: parsedLimit,
        where: filters,
        order: order,
        include: [
          {
            model: BookImage,
            as: "images",
            attributes: ["id", "imageUrl", "public_id"],
          },
          {
            model: Genre,
            as: "genres",
            through: { attributes: [] },
            attributes: ["genreid", "genre_title"],
            ...(genreId && {
              where: { genreid: genreId },
              required: true,
            }),
          },
          {
            model: BookReview,
            as: "reviews",
            attributes: ["id", "rating", "comment", "createdAt", "updatedAt"],
            include: {
              model: User,
              as: "user",
              attributes: ["id", "username"],
              include: [
                {
                  model: UserImage,
                  as: "profileImage",
                  attributes: ["id", "imageUrl", "public_id"],
                },
              ],
            },
          },
          {
            model: BookStats,
            as: "stats",
            attributes: [
              "id",
              "views",
              "wishlistCount",
              "cartCount",
              "purchases",
            ],
          },
        ],

        offset,
        // logging: console.log,
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        results: rows,
        total: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async getAllClient(req, res) {
    const {
      isPopular,
      title,
      categoryId,
      page = 1,
      limit = 10,
      sortBy = "newest", // newest, oldest, priceAsc, priceDesc, popular
      minPrice,
      maxPrice,
      stockAvailble = true,
      search, // Search by title or author
      status,
      isRecomend,
    } = req.query;

    const filters = {};

    // Filter by popularity
    if (isPopular !== undefined) {
      filters.isPopular = isPopular === "true" || isPopular === "1";
    }

    // Filter by category
    if (categoryId) {
      filters.categoryId = categoryId;
    }

    // Search by title
    if (title) {
      filters.title = { [Op.like]: `%${title}%` };
    }

    if (status) {
      filters.status = status;
    }

    // Universal search (title, author, description)
    if (search) {
      filters[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (!stockAvailble) {
      filters.stockAvailble = false;
    }
    if (isRecomend) {
      filters.isRecomend;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) filters.price[Op.lte] = parseFloat(maxPrice);
    }

    const userId = req.id;
    const offset = (page - 1) * limit;

    console.log(">>> Filters:", JSON.stringify(filters, null, 2));
    console.log(">>> Sort By:", sortBy);

    try {
      // Determine sorting order
      let orderClause;
      switch (sortBy) {
        case "popular":
          orderClause = [[{ model: BookStats, as: "stats" }, "views", "DESC"]];
          break;
        case "priceAsc":
          orderClause = [["price", "ASC"]];
          break;
        case "priceDesc":
          orderClause = [["price", "DESC"]];
          break;
        case "oldest":
          orderClause = [["createdAt", "ASC"]];
          break;
        case "newest":
        default:
          orderClause = [["createdAt", "DESC"]];
          break;
      }

      const { count, rows } = await Book.findAndCountAll({
        where: filters,
        order: orderClause,
        limit: parseInt(limit),
        include: [
          {
            model: BookImage,
            as: "images",
            attributes: ["id", "imageUrl", "public_id"],
          },
          {
            model: Genre,
            as: "genres",
            through: { attributes: [] },
            attributes: ["genreid", "genre_title"],
          },
          {
            model: BookReview,
            as: "reviews",
            attributes: ["id", "rating", "comment", "createdAt", "updatedAt"],
            include: {
              model: User,
              as: "user",
              attributes: ["id", "username"],
              include: [
                {
                  model: UserImage,
                  as: "profileImage",
                  attributes: ["id", "imageUrl", "public_id"],
                },
              ],
            },
          },
          {
            model: BookStats,
            as: "stats",
            attributes: [
              "id",
              "views",
              "wishlistCount",
              "cartCount",
              "purchases",
            ],
          },
          ...(req.id
            ? [
                {
                  model: User,
                  as: "wishlistUsers",
                  through: {
                    model: UserWishlist,
                    where: { userId },
                    attributes: [],
                  },
                  required: false,
                  attributes: ["id"],
                },
                {
                  model: User,
                  as: "cartUsers",
                  through: {
                    model: UserCart,
                    where: { userId },
                    attributes: [],
                  },
                  required: false,
                  attributes: ["id"],
                },
              ]
            : []),
        ],
        offset,
        distinct: true,
        // logging: console.log,
      });

      const results = rows.map((book) => {
        const bookJson = book.toJSON();
        return {
          ...bookJson,
          isWishlisted:
            bookJson.wishlistUsers && bookJson.wishlistUsers.length > 0,
          isInCart: bookJson.cartUsers && bookJson.cartUsers.length > 0,
        };
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        results: results,
        total: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        filters: {
          search,
          sortBy,
          minPrice,
          maxPrice,
          stockAvailble,
          categoryId,
          status,
        },
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async getAll(req, res) {
    const {
      isPopular,
      title,
      categoryId,
      genreId,
      page = 1,
      limit,
      status,
      isRecomend,
      sortPrice,
      onlyAvailable = "",
      sortDate = "",
    } = req.query;

    const parsedSortPrice = parseInt(sortPrice);
    console.log("Full Query: ", req.query);
    console.log("SortDate: ", sortDate);
    const filters = {};
    if (isPopular !== undefined) {
      filters.isPopular = isPopular === "true" || isPopular === "1";
    }

    if (isRecomend) {
      filters.isRecomend = true;
    }
    if (categoryId) filters.categoryId = categoryId;

    if (title) {
      filters.title = { [Op.like]: `%${title}%` };
    }
    if (status) {
      filters.status = status;
    }
    if (onlyAvailable === "true") {
      filters.quantity = {
        [Op.gt]: 0,
      };
    }
    const userId = req.id;
    const parsedLimit = limit ? parseInt(limit) : null;

    const offset = (page - 1) * parsedLimit;
    console.log(">>> req.id:", req.id);
    console.log(">>> req.user:", req.user);
    console.log("search title: ", title);
    console.log("isPopular:", isPopular);
    console.log("Login as user");

    try {
      const order = [];

      if (parsedSortPrice) {
        order.push(["price", parsedSortPrice === 1 ? "ASC" : "DESC"]);
      }

      if (sortDate === "newest_saved") {
        order.push(["createdAt", "DESC"]);
      }

      if (sortDate === "oldest_saved") {
        order.push(["createdAt", "ASC"]);
      }

      if (isPopular) {
        order.push([{ model: BookStats, as: "stats" }, "views", "DESC"]);
      }

      const total = await Book.count({
        where: filters,
        include: [
          ...(genreId
            ? [
                {
                  model: Genre,
                  as: "genres",
                  where: { genreid: genreId },
                  required: true,
                  through: { attributes: [] },
                },
              ]
            : []),
        ],
      });
      const rows = await Book.findAll({
        where: filters,
        order: order,
        limit: parsedLimit || undefined,
        include: [
          {
            model: BookImage,
            as: "images",
            attributes: ["id", "imageUrl", "public_id"],
          },
          {
            model: Genre,
            as: "genres",
            through: { attributes: [] },
            attributes: ["genreid", "genre_title"],
            ...(genreId && {
              where: { genreid: genreId },
              required: true,
            }),
          },
          {
            model: BookReview,
            as: "reviews",
            attributes: ["id", "rating", "comment", "createdAt", "updatedAt"],
            include: {
              model: User,
              as: "user",
              attributes: ["id", "username"],
              include: [
                {
                  model: UserImage,
                  as: "profileImage",
                  attributes: ["id", "imageUrl", "public_id"],
                },
              ],
            },
          },
          {
            model: BookStats,
            as: "stats",
            attributes: [
              "id",
              "views",
              "wishlistCount",
              "cartCount",
              "purchases",
            ],
          },

          ...(req.id
            ? [
                {
                  model: User,
                  as: "wishlistUsers",
                  through: {
                    model: UserWishlist,
                    where: { userId },
                    attributes: [],
                  },
                  required: false,
                  attributes: ["id"],
                },
                {
                  model: User,
                  as: "cartUsers",
                  through: {
                    model: UserCart,
                    where: { userId },
                    attributes: [],
                  },
                  required: false,
                  attributes: ["id"],
                },
              ]
            : []),
        ],

        offset,
        distinct: true,
        // logging: console.log,
      });
      const results = rows.map((book) => {
        const bookJson = book.toJSON();
        return {
          ...bookJson,
          isWishlisted:
            bookJson.wishlistUsers && bookJson.wishlistUsers.length > 0,
          isInCart: bookJson.cartUsers && bookJson.cartUsers.length > 0,
        };
      });
      res.status(200).json({
        status: 200,
        message: "Success",
        results: results,
        total: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parsedLimit),
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
  async cmsGetAll(req, res) {
    const {
      isPopular,
      title,
      categoryId,
      page = 1,
      limit = 10,
      isRecomend,
    } = req.query;

    const filters = {};
    if (isPopular !== undefined) {
      filters.isPopular = isPopular === "true" || isPopular === "1";
    }
    if (categoryId) filters.categoryId = categoryId;
    if (title) {
      filters.title = { [Op.like]: `%${title}%` };
    }

    const whereCondition = req.id
      ? { ...filters, createdByAdminId: req.id }
      : filters;

    if (isRecomend) {
      filters.isRecomend = true;
    }
    const offset = (page - 1) * limit;
    try {
      console.log("userId logined: ", req.id);
      const { count, rows } = await Book.findAndCountAll({
        where: whereCondition,
        distinct: true,
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        include: [
          {
            model: BookImage,
            as: "images",
            attributes: ["id", "imageUrl", "public_id"],
          },
          {
            model: Genre,
            as: "genres",
            through: { attributes: [] },
            attributes: ["genreid", "genre_title"],
          },
          {
            model: BookReview,
            as: "reviews",
            attributes: ["id", "rating", "comment", "createdAt", "updatedAt"],
            include: {
              model: User,
              as: "user",
              attributes: ["id", "username"],
              include: [
                {
                  model: UserImage,
                  as: "profileImage",
                  attributes: ["id", "imageUrl", "public_id"],
                },
              ],
            },
          },
          {
            model: BookStats,
            as: "stats",
            attributes: [
              "id",
              "views",
              "wishlistCount",
              "cartCount",
              "purchases",
            ],
          },
          // ...(req.id
          //   ? [
          //       {
          //         model: User,
          //         as: "wishlistUsers",
          //         through: {
          //           model: UserWishlist,
          //           attributes: [],
          //         },
          //         where: { id: req.id },
          //         required: false,
          //
          //       },
          //     ]
          //   : []),
        ],
        offset,
      });
      const results = rows.map((book) => {
        const bookJson = book.toJSON();
        return {
          ...bookJson,
          isWishlisted:
            bookJson.wishlistUsers && bookJson.wishlistUsers.length > 0,
          isInCart: bookJson.cartUsers && bookJson.cartUsers.length > 0,
        };
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        results: results,
        total: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async getOne(req, res) {
    const userId = req.id;

    console.log("UserID Get One: ", userId);
    try {
      const { id } = req.params;
      // const {} = req.query
      const book = await Book.findOne({
        where: { id },
        include: [
          {
            model: BookImage,
            as: "images",
            attributes: ["id", "imageUrl", "public_id"],
          },
          {
            model: Genre,
            as: "genres",
            attributes: ["genreId", "genre_title"],
          },
          {
            model: BookReview,
            as: "reviews",
            where: { status: "APPROVED" },
            required: false,
            attributes: [
              "id",
              "rating",
              "comment",
              "createdAt",
              "updatedAt",
              "status",
            ],
            include: {
              model: User,
              as: "user",
              attributes: ["id", "username"],
              include: [
                {
                  model: UserImage,
                  as: "profileImage",
                  attributes: ["id", "imageUrl", "public_id"],
                },
              ],
            },
          },
          {
            model: User,
            as: "wishlistUsers",
            attributes: ["id"],
            through: { attributes: [] },
            required: false,
            where: { id: userId },
          },
          {
            model: User,
            as: "cartUsers",
            attributes: ["id"],
            through: { attributes: [] },
            required: false,
            where: { id: userId },
          },
        ],
      });

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const bookData = book.toJSON();

      const isInCart =
        bookData.cartUsers && bookData.cartUsers.length > 0 ? true : false;

      delete bookData.cartUsers;
      res.status(200).json({
        message: "Success",
        result: {
          ...bookData,
          isInCart,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBook(req, res) {
    const t = await sequelize.transaction();
    try {
      const { images } = req.body;

      const parsedImages =
        typeof images === "string" ? JSON.parse(images) : images;

      if (!parsedImages || parsedImages.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one book cover is required." });
      }

      const newBook = await Book.create(
        {
          title: req.body.title,
          author: req.body.author,
          price: req.body.price,
          book_type: req.body.book_type,
          status: req.body.status,
          description: req.body.description,
          isPopular: req.body.isPopular || false,
          categoryId: req.body.categoryId || null,
          quantity: req.body.quantity || 0,
          createdByAdminId: req.id,
        },
        { transaction: t },
      );

      await BookStats.create(
        {
          bookId: newBook.id,
          purchaseCount: 0,
          wishlistCount: 0,
          popularityScore: 0,
        },
        { transaction: t },
      );
      const bookImagesData = parsedImages.map((img) => ({
        bookId: newBook.id,
        imageUrl: img.imageUrl,
        public_id: img.public_id,
      }));
      await BookImage.bulkCreate(bookImagesData, { transaction: t });

      let genreIds = req.body.genres;
      if (typeof genreIds === "string") {
        genreIds = [genreIds];
      }
      if (Array.isArray(genreIds)) {
        await newBook.setGenres(genreIds, { transaction: t });
      }

      await t.commit();

      res.status(200).json({
        message: "Book created Successfully",
        results: {
          ...newBook.toJSON(),
          images: bookImagesData,
        },
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },
  async updateBook(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id, { transaction: t });

      if (!book) {
        await t.rollback();
        return res.status(404).json({ message: "Book not found" });
      }

      // const { title, author, price, book_type, isPopular, categoryId } =
      //   req.body;
      let images = req.body.images;
      // let genreIds = req.body.genres;
      // Update book utama
      await Book.update(req.body, {
        where: { id },
        transaction: t,
      });

      // === Update genre relasi ===
      if (req.body.genres !== undefined) {
        let genreIds = req.body.genres;

        // Handle different input formats
        if (typeof genreIds === "string") {
          try {
            // Try to parse as JSON first
            genreIds = JSON.parse(genreIds);
          } catch {
            // If not JSON, treat as single ID
            genreIds = [genreIds];
          }
        }

        // Ensure it's an array and contains valid IDs
        if (Array.isArray(genreIds)) {
          // Convert to integers and filter invalid ones
          const validGenreIds = genreIds
            .map((g) => {
              if (typeof g === "object") {
                return g.genreId || g.id;
              }
              return g;
            })
            .filter((id) => typeof id === "string" && id.length > 10);

          console.log("Valid genre IDs:", validGenreIds);

          // Update the association
          await book.setGenres(validGenreIds, { transaction: t });
        } else if (genreIds === null || genreIds === "") {
          // Clear all genres if empty
          await book.setGenres([], { transaction: t });
        }
      }
      // === Proses images dengan debugging ===
      console.log("=== DEBUG IMAGES ===");
      console.log("Raw images:", req.body.images);
      console.log("Images type:", typeof images);

      if (typeof images === "string") {
        try {
          images = JSON.parse(images);
          console.log("Parsed images:", images);
        } catch (err) {
          console.error("Gagal parse images:", err.message);
          images = [];
        }
      }

      if (Array.isArray(images)) {
        console.log("Images array:", images);

        const sentImageIds = images
          .filter((img) => img.id)
          .map((img) => img.id);
        console.log("sentImageIds:", sentImageIds);

        // Cek gambar yang ada di database sebelum update
        const existingImagesInDB = await BookImage.findAll({
          where: { bookId: id },
          attributes: ["id", "imageUrl", "public_id"],
          transaction: t,
        });
        console.log(
          "Existing images in DB:",
          existingImagesInDB.map((img) => img.id),
        );

        // Update gambar yang sudah ada
        const existingImages = images.filter((img) => img.id && img.imageUrl);
        console.log(
          "Images to update:",
          existingImages.map((img) => img.id),
        );

        for (const img of existingImages) {
          await BookImage.update(
            {
              imageUrl: img.imageUrl,
              public_id: img.public_id || null,
            },
            {
              where: { id: img.id, bookId: id },
              transaction: t,
            },
          );
        }

        // Hapus gambar yang tidak dikirim
        const imagesToDelete = existingImagesInDB.filter(
          (existingImg) => !sentImageIds.includes(existingImg.id),
        );

        console.log(
          "Images to delete:",
          imagesToDelete.map((img) => img.id),
        );

        if (imagesToDelete.length > 0) {
          // Delete dari Cloudinary

          console.log("Deleting from Cloudinary...");
          await Promise.all(
            imagesToDelete.map((img) => deleteFromCloudinary(img.imageUrl)),
          );
          const deleteResult = await BookImage.destroy({
            where: {
              bookId: id,
              id: imagesToDelete.map((img) => img.id),
            },
            transaction: t,
          });
          console.log("Delete result:", deleteResult);
        }
        // Tambah gambar baru
        const newImages = images.filter((img) => !img.id && img.imageUrl);
        console.log("New images to add:", newImages.length);

        if (newImages.length > 0) {
          const imageData = newImages.map((img) => ({
            bookId: id,
            imageUrl: img.imageUrl,
            public_id: img.public_id || null,
          }));
          await BookImage.bulkCreate(imageData, { transaction: t });
        }
      }

      console.log("=== END DEBUG IMAGES ===");

      await t.commit();
      return res.status(200).json({
        message: "Book and images updated successfully",
      });
    } catch (error) {
      await t.rollback();
      console.log("Error: ", error);
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },

  async deleteBook(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const book = await Book.findByPk(id, { transaction: t });
      if (!book) {
        await t.rollback();
        return res.status(404).json({ message: "Book not found" });
      }
      await book.setGenres([], { transaction: t });
      const bookImages = await BookImage.findAll({
        where: { bookId: id },
        attributes: ["id", "public_id", "imageUrl"],
        transaction: t,
      });

      console.log(`Found ${bookImages.length} images to delete`);
      if (bookImages.length > 0) {
        console.log("Deleting from Cloudinary...");
        await Promise.all(
          bookImages.map((img) => deleteFromCloudinary(img.imageUrl)),
        );

        console.log("Deleting images from database...");
        await BookImage.destroy({
          where: { bookId: id },
          transaction: t,
        });
      }

      console.log("Deleting book from database...");
      const result = await Book.destroy({
        where: { id },
        transaction: t,
      });

      await t.commit();

      res.status(200).json({
        status: 200,
        message: "Book deleted successfully",
        result,
      });
    } catch (error) {
      await t.rollback();
      console.error("Delete book error:", error);
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
};

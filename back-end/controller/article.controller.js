const { Articles, ArticleImages } = require("../models/index");
const { sequelize } = require("../config/database");
// /**field tambahan untuk endpoint article
//  * 1. isPopular: boolean,
//  * 2. isPublished: Enum,
//  * 3.
//  */
module.exports = {
  async getAll(req, res) {
    const { isPopular, title, categoryId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
      const { count, rows } = await Articles.findAndCountAll({
        limit: parseInt(limit),
        distinct: true,
        include: [
          {
            model: ArticleImages,
            as: "articleImages",
            attributes: ["id", "imageUrl", "public_id"],
          },
        ],

        offset,
        logging: console.log,
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        results: rows,
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
    try {
      const { id } = req.params;
      const article = await Articles.findOne({
        where: { id },
        include: [
          {
            model: ArticleImages,
            as: "articleImages",
            attributes: ["id", "imageUrl", "public_id"],
          },
        ],
      });

      if (!Articles) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({
        message: "Success",
        result: article,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async createArticle(req, res) {
    const t = await sequelize.transaction();
    try {
      const { articleImages, id } = req.body;

      const parsedImages =
        typeof articleImages === "string"
          ? JSON.parse(articleImages)
          : articleImages;

      const imageArray = [].concat(parsedImages || []);

      const newArticle = await Articles.create(
        {
          ...req.body,
          createdByAdminId: req.id,
        },
        { transaction: t },
      );

      const articleImageData = imageArray.map((img) => ({
        articleId: newArticle.id,
        imageUrl: img.imageUrl,
        public_id: img.public_id,
      }));

      await ArticleImages.bulkCreate(articleImageData, { transaction: t });

      await t.commit();

      res.status(201).json({
        status: 201,
        message: "Success create user",
        result: {
          ...newArticle.toJSON(),
          articleImage: articleImageData,
        },
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
  async updateArticle(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
      let articleImages = req.body.articleImages;

      const article = await Articles.findByPk(id, { transaction: t });
      if (!article) {
        await t.rollback();
        return res.status(404).json({ message: "Article not found" });
      }
      await Articles.update(
        {
          ...req.body,
        },
        { where: { id } },
      );

      if (typeof articleImages === "string") {
        try {
          articleImages = JSON.parse(articleImages);
          console.log("Parsed articleImages:", articleImages);
        } catch (err) {
          console.error("Gagal parse articleImages:", err.message);
          articleImages = null;
        }
      }

      // Ambil object tunggal dari array jika hanya berisi satu
      if (Array.isArray(articleImages) && articleImages.length === 1) {
        articleImages = articleImages[0];
      }

      if (typeof articleImages === "object" && articleImages !== null) {
        const existingImage = await ArticleImages.findOne({
          where: { articleId: id },
          attributes: ["id", "imageUrl", "public_id"],
          transaction: t,
        });

        if (articleImages.id && articleImages.imageUrl) {
          console.log("Updating existing image:", articleImages.id);
          await ArticleImages.update(
            {
              imageUrl: articleImages.imageUrl,
              public_id: articleImages.public_id || null,
            },
            {
              where: { id: articleImages.id, userId: id },
              transaction: t,
            },
          );
        } else if (!articleImages.id && articleImages.imageUrl) {
          console.log("Adding new profile image");
          await UserImage.create(
            {
              userId: id,
              imageUrl: articleImages.imageUrl,
              public_id: articleImages.public_id || null,
            },
            { transaction: t },
          );

          if (existingImage) {
            console.log("Deleting old image:", existingImage.id);
            await deleteFromCloudinary(existingImage.imageUrl);
            await ArticleImages.destroy({
              where: { id: existingImage.id },
              transaction: t,
            });
          }
        } else {
          console.warn("Image tidak valid, tidak diproses.");
        }
      } else {
        console.warn("articleImages is null or not an object.");
      }
      await t.commit();
      res
        .status(200)
        .json({ status: 200, message: "Article updated successfully" });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
  async deleteArticle(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const article = await Articles.findByPk(id, { transaction: t });

      if (!article) {
        await t.rollback();
        return res.status(404).json({
          status: 404,
          message: "Article not found",
          result: null,
        });
      }

      const articleImages = await ArticleImages.findAll({
        where: { articleId: id },
        attributes: ["id", "public_id", "imageUrl"],
        transaction: t,
      });

      console.log(`Found ${articleImages.length} images to delete`);

      if (articleImages.length > 0) {
        console.log("Deleting from Cloudinary...");
        await Promise.all(
          articleImages.map((img) => deleteFromCloudinary(img.imageUrl)),
        );

        console.log("Deleting images from database...");
        await articleImages.destroy({
          where: { articleId: id },
          transaction: t,
        });
      }
      console.log("Deleting article from database...");
      const result = await Articles.destroy({ where: { id }, transaction: t });

      await t.commit();

      res.status(200).json({
        status: 200,
        message: "Article deleted successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
};

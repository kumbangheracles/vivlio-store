// const { Article, ArticleImage } = require("../models/index");
// /**field tambahan untuk endpoint article
//  * 1. isPopular: boolean,
//  * 2. isPublished: Enum,
//  * 3.
//  */
// module.exports = {
//   async getAll(req, res) {
//     const { isPopular, title, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;
//     try {
//       const { count, rows } = await Article.findAndCountAll({
//         limit: parseInt(limit),
//         include: [
//           {
//             model: ArticleImage,
//             as: "articleImage",
//             attributes: ["articleId", "imageUrl", "public_id"],
//           },
//           //   {
//           //     model: Genre,
//           //     as: "genres",
//           //     through: { attributes: [] },
//           //     attributes: ["genreid", "genre_title"],
//           //   },
//           //   {
//           //     model: ArticleStats,
//           //     as: "stats",
//           //     attributes: [
//           //       "id",
//           //       "views",
//           //       "wishlistCount",
//           //       "cartCount",
//           //       "purchases",
//           //     ],
//           //   },
//         ],

//         offset,
//         // logging: console.log,
//       });

//       res.status(200).json({
//         status: 200,
//         message: "Success",
//         results: rows,
//         total: count,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(count / limit),
//       });
//     } catch (error) {
//       res.status(500).json({
//         status: 500,
//         message: error.message || "Internal server error",
//         data: [],
//       });
//     }
//   },
//   async getAllPublic(req, res) {
//     const { isPopular, title, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;
//     try {
//       const { count, rows } = await Article.findAndCountAll({
//         limit: parseInt(limit),
//         include: [
//           {
//             model: ArticleImage,
//             as: "articleImage",
//             attributes: ["articleId", "imageUrl", "public_id"],
//           },
//           //   {
//           //     model: Genre,
//           //     as: "genres",
//           //     through: { attributes: [] },
//           //     attributes: ["genreid", "genre_title"],
//           //   },
//           //   {
//           //     model: ArticleStats,
//           //     as: "stats",
//           //     attributes: [
//           //       "id",
//           //       "views",
//           //       "wishlistCount",
//           //       "cartCount",
//           //       "purchases",
//           //     ],
//           //   },
//         ],

//         offset,
//         // logging: console.log,
//       });

//       res.status(200).json({
//         status: 200,
//         message: "Success",
//         results: rows,
//         total: count,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(count / limit),
//       });
//     } catch (error) {
//       res.status(500).json({
//         status: 500,
//         message: error.message || "Internal server error",
//         data: [],
//       });
//     }
//   },
//   async getOne(req, res) {
//     try {
//       const { articleId } = req.params;
//       const article = await Article.findOne({
//         where: { articleId },
//         include: [
//           {
//             model: ArticleImage,
//             as: "articleImage",
//             attributes: ["articleId", "imageUrl", "public_id"],
//           },
//           //   {
//           //     model: Genre,
//           //     as: "genres",
//           //     attributes: ["genreId", "genre_title"],
//           //   },
//         ],
//       });

//       if (!article) {
//         return res.status(404).json({ message: "Article not found" });
//       }

//       res.status(200).json({
//         message: "Success",
//         result: article,
//       });
//     } catch (err) {
//       res.status(500).json({
//         status: 500,
//         message: error.message || "Internal server error",
//         data: [],
//       });
//     }
//   },
//   async createArticle(req, res) {
//     try {
//     } catch (error) {}
//   },
//   async updateArticle(req, res) {
//     try {
//     } catch (error) {}
//   },
//   async deleteArticle(req, res) {
//     try {
//     } catch (error) {}
//   },
// };

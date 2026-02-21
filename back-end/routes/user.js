const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, UserImage } = require("../models/index");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const { sequelize } = require("../config/database");
const { deleteFromCloudinary } = require("../helpers/deleteCoudinary");
const { encrypt } = require("../config/encryption");
router.get(
  "/public",
  authMiddleware,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { page = 1, limit = 10, id } = req.query;
    const offset = (page - 1) * limit;
    try {
      const { count, rows } = await User.findAndCountAll({
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        include: [
          {
            model: UserImage,
            as: "profileImage",
            attributes: ["id", "imageUrl", "public_id"],
          },
        ],
        offset,
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
);
router.get(
  "/",
  authMiddleware,
  checkRole(["admin", "super_admin"]),
  async (req, res) => {
    const { page = 1, limit = 10, id } = req.query;
    const offset = (page - 1) * limit;
    try {
      if (!req.id)
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
        });
      const { count, rows } = await User.findAndCountAll({
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        include: [
          {
            model: UserImage,
            as: "profileImage",
            attributes: ["id", "imageUrl", "public_id"],
          },
        ],
        offset,
      });

      // const filtersWithAdminId = req.id
      //   ? rows.filter((item) => item.createdByAdminId === req.id)
      //   : rows;

      res.status(200).json({
        where: !!req.id,
        status: 200,
        message: "Success",
        results: rows,
        total: count,
        currentPage: parseInt(page, 10),
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
);

router.get(
  "/:id",
  authMiddleware,
  checkRole(["admin", "customer", "super_admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: { id: id },
        include: [
          {
            model: UserImage,
            as: "profileImage",
            attributes: ["id", "imageUrl", "public_id"],
          },
        ],
      });

      res.status(200).json({
        status: 200,
        message: "Success",
        result: user,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
);

// router.post(
//   "/",
//   [
//     authMiddleware,
//     checkRole(["admin", "super_admin"]),
//     uploadMiddleware.single("profileImage"),
//   ],
//   async (req, res) => {
//     const t = await sequelize.transaction();
//     try {
//       const { fullName, username, email, password, roleId } = req.body;

//       // Ambil files dari multer
//       const file = req.file;

//       if (!file) {
//         return res.status(400).json({
//           message: "Profile image must be uploaded.",
//         });
//       }

//       // Upload ke Cloudinary
//       const uploadedImage = await uploader.uploadSingle(file);

//       const user = await User.create(
//         {
//           fullName,
//           username,
//           email,
//           password,
//           roleId,
//         },
//         { transaction: t }
//       );
//       await UserImage.bulkCreate(
//         {
//           userId: user.id,
//           imageUrl: uploadedImage.secure_url,
//           public_id: uploadedImage.public_id,
//         },
//         { transaction: t }
//       );

//       await t.commit();

//       res.status(201).json({
//         status: 201,
//         message: "Success create user",
//         result: {
//           ...user.toJSON(),
//           profileImage: {
//             userId: user.id,
//             imageUrl: uploadedImage.secure_url,
//             public_id: uploadedImage.public_id,
//           },
//         },
//       });
//     } catch (error) {
//       await t.rollback();
//       res.status(500).json({
//         status: 500,
//         message: error.message || "Internal server error",
//         data: [],
//       });
//     }
//   }
// );

router.post(
  "/",
  [
    authMiddleware,
    checkRole(["admin", "super_admin"]),
    uploadMiddleware.single("profileImage"),
  ],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { fullName, username, email, password, roleId, profileImage } =
        req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
          status: 400,
          message: "Email tidak valid",
        });
      }
      const parsedImages =
        typeof profileImage === "string"
          ? JSON.parse(profileImage)
          : profileImage;

      const imageArray = [].concat(parsedImages || []);
      const hashedPassword = await bcrypt.hash(password, 10);
      if (username === "herkalsuperadmin") {
        return res.status(400).json({
          status: 400,
          message: "This user cannot be inactivated",
        });
      }
      if (username.length > 10) {
        return res.status(400).json({
          status: 400,
          message: "Username cannot be more than 10 characters",
        });
      }
      const user = await User.create(
        {
          fullName,
          username,
          email,
          password,
          roleId,
          isVerified: true,
          createdByAdminId: req.id,
        },
        { transaction: t },
      );

      const profileImageData = imageArray.map((img) => ({
        userId: user.id,
        imageUrl: img.imageUrl,
        public_id: img.public_id,
      }));

      await UserImage.bulkCreate(profileImageData, { transaction: t });

      await t.commit();

      res.status(201).json({
        status: 201,
        message: "Success create user",
        result: {
          ...user.toJSON(),
          profileImage: profileImageData,
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
);

router.patch(
  "/:id",
  [
    authMiddleware,
    checkRole(["admin", "super_admin", "customer"]),
    uploadMiddleware.single("profileImage"),
  ],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      if (req.body.fullName.length >= 25) {
        return res
          .status(400)
          .json({ message: "Full Name maximum 25 character." });
      }

      let profileImage = req.body.profileImage;

      const user = await User.findByPk(id, { transaction: t });

      if (
        req.body.username === "herkalsuperadmin" &&
        req.body.isActivated === false
      ) {
        return res.status(400).json({
          status: 400,
          message: "This user cannot be inactivated",
        });
      }
      if (!user) {
        await t.rollback();
        return res.status(404).json({ message: "User not found" });
      }
      const updateData = { ...req.body };

      if (req.body.password) {
        const isSamePassword = await encrypt(req.body.password, user.password);

        if (!isSamePassword) {
          updateData.password = await encrypt(req.body.password, 10);
        } else {
          delete updateData.password;
        }
      } else {
        delete updateData.password;
      }

      await User.update(updateData, {
        where: { id },
        transaction: t,
      });

      if (typeof profileImage === "string") {
        try {
          profileImage = JSON.parse(profileImage);
          console.log("Parsed profileImage:", profileImage);
        } catch (err) {
          console.error("Gagal parse profileImage:", err.message);
          profileImage = null;
        }
      }

      if (Array.isArray(profileImage) && profileImage.length === 1) {
        profileImage = profileImage[0];
      }

      if (typeof profileImage === "object" && profileImage !== null) {
        const existingImage = await UserImage.findOne({
          where: { userId: id },
          attributes: ["id", "imageUrl", "public_id"],
          transaction: t,
        });

        if (profileImage.id && profileImage.imageUrl) {
          console.log("Updating existing image:", profileImage.id);
          await UserImage.update(
            {
              imageUrl: profileImage.imageUrl,
              public_id: profileImage.public_id || null,
            },
            {
              where: { id: profileImage.id, userId: id },
              transaction: t,
            },
          );
        } else if (!profileImage.id && profileImage.imageUrl) {
          console.log("Adding new profile image");
          await UserImage.create(
            {
              userId: id,
              imageUrl: profileImage.imageUrl,
              public_id: profileImage.public_id || null,
            },
            { transaction: t },
          );

          if (existingImage) {
            console.log("Deleting old image:", existingImage.id);
            await deleteFromCloudinary(existingImage.imageUrl);
            await UserImage.destroy({
              where: { id: existingImage.id },
              transaction: t,
            });
          }
        } else {
          console.warn("Image tidak valid, tidak diproses.");
        }
      } else {
        console.warn("profileImage is null or not an object.");
      }
      await t.commit();
      res
        .status(200)
        .json({ status: 200, message: "User updated successfully" });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
);

router.patch(
  "/cms/:id",
  [
    authMiddleware,
    checkRole(["admin", "super_admin", "customer"]),
    uploadMiddleware.single("profileImage"),
  ],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const allowedFields = [
        "fullName",
        "username",
        "email",
        "isActivated",
        "profileImage",
      ];
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      if ("password" in req.body) {
        await t.rollback();
        return res.status(400).json({
          status: 400,
          message: "Password cannot be updated from this endpoint",
        });
      }

      if ("password" in req.body) {
        delete req.body.password;
      }

      let profileImage = req.body.profileImage;

      const user = await User.findByPk(id, { transaction: t });

      if (
        req.body.username === "herkalsuperadmin" &&
        req.body.isActivated === false
      ) {
        return res.status(400).json({
          status: 400,
          message: "This user cannot be inactivated",
        });
      }
      if (!user) {
        await t.rollback();
        return res.status(404).json({ message: "User not found" });
      }

      const updateData = {};
      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      }
      await User.update(updateData, {
        where: { id },
        transaction: t,
      });

      if (typeof profileImage === "string") {
        try {
          profileImage = JSON.parse(profileImage);
          console.log("Parsed profileImage:", profileImage);
        } catch (err) {
          console.error("Gagal parse profileImage:", err.message);
          profileImage = null;
        }
      }

      // Ambil object tunggal dari array jika hanya berisi satu
      if (Array.isArray(profileImage) && profileImage.length === 1) {
        profileImage = profileImage[0];
      }

      if (typeof profileImage === "object" && profileImage !== null) {
        const existingImage = await UserImage.findOne({
          where: { userId: id },
          attributes: ["id", "imageUrl", "public_id"],
          transaction: t,
        });

        if (profileImage.id && profileImage.imageUrl) {
          console.log("Updating existing image:", profileImage.id);
          await UserImage.update(
            {
              imageUrl: profileImage.imageUrl,
              public_id: profileImage.public_id || null,
            },
            {
              where: { id: profileImage.id, userId: id },
              transaction: t,
            },
          );
        } else if (!profileImage.id && profileImage.imageUrl) {
          console.log("Adding new profile image");
          await UserImage.create(
            {
              userId: id,
              imageUrl: profileImage.imageUrl,
              public_id: profileImage.public_id || null,
            },
            { transaction: t },
          );

          if (existingImage) {
            console.log("Deleting old image:", existingImage.id);
            await deleteFromCloudinary(existingImage.imageUrl);
            await UserImage.destroy({
              where: { id: existingImage.id },
              transaction: t,
            });
          }
        } else {
          console.warn("Image tidak valid, tidak diproses.");
        }
      } else {
        console.warn("profileImage is null or not an object.");
      }
      await t.commit();
      res
        .status(200)
        .json({ status: 200, message: "User updated successfully" });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        status: 500,
        message: error.message || "Internal server error",
        data: [],
      });
    }
  },
);

router.delete(
  "/:id",
  [
    authMiddleware,
    checkRole(["admin", "super_admin", "customer"]),
    // uploadMiddleware.destroy("profileImage"),
  ],
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { transaction: t });

      if (!user) {
        await t.rollback();
        return res.status(404).json({
          status: 404,
          message: "User not found",
          result: null,
        });
      }

      const userImage = await UserImage.findAll({
        where: { userId: id },
        attributes: ["id", "public_id", "imageUrl"],
        transaction: t,
      });

      console.log(`Found ${userImage.length} images to delete`);

      if (userImage.length > 0) {
        console.log("Deleting from Cloudinary...");
        await Promise.all(
          userImage.map((img) => deleteFromCloudinary(img.imageUrl)),
        );

        console.log("Deleting images from database...");
        await UserImage.destroy({
          where: { userId: id },
          transaction: t,
        });
      }
      console.log("Deleting user from database...");
      const result = await User.destroy({ where: { id }, transaction: t });

      await t.commit();

      res.status(200).json({
        status: 200,
        message: "User deleted successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

module.exports = router;

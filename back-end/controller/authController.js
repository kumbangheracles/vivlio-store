const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Yup = require("yup");
const { Op } = require("sequelize");
const sendEmailVerification = require("../service/email.service");
const { v4: uuidv4 } = require("uuid");
const { generateVerificationCode } = require("../utils/verificationCode");
const registerValidateModels = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Password not match"),
  role: Yup.string()
    .oneOf(["admin", "customer"], "Invalid role")
    .required("Role is required"),
});
module.exports = {
  async register(req, res) {
    const { fullName, username, email, password, confirmPassword, role } =
      req.body;
    try {
      await registerValidateModels.validate({
        fullName,
        username,
        email,
        password,
        role,
        confirmPassword,
      });
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = generateVerificationCode();
      const verificationCodeCreatedAt = new Date();
      const result = await User.create({
        fullName,
        username,
        email,
        password: hashedPassword,
        role,
        verificationCode,
        verificationCodeCreatedAt,
        isVerified: false,
      });
      await sendEmailVerification(email, verificationCode);
      res.status(200).json({
        message:
          "Success Registration! Please check your email for verification code.",
        data: result,
      });
    } catch (error) {
      console.log("Error validate register: ", error);
      res.status(400).json({
        message: error.message,
        data: null,
      });
    }
  },

  /**
   * @swagger
   * components:
   *   schemas:
   *     ResendVerificationCodeRequest:
   *       type: object
   *       required:
   *         - email
   *       properties:
   *         email:
   *           type: string
   *           format: email
   *           example: user@example.com
   *        message:
   *           type: string
   *           example: "Verification code resent successfully."
   */

  async resendVerificationCode(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.isVerified)
        return res.status(400).json({ message: "User already verified" });

      const code = generateVerificationCode();
      const createdAt = new Date();

      await user.update({
        verificationCode: code,
        verificationCodeCreatedAt: createdAt,
      });

      await sendEmailVerification(email, code);

      res.status(200).json({ message: "Verification code resent!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  /**
   * @swagger
   * components:
   *   schemas:
   *     VerifyEmailRequest:
   *       type: object
   *       required:
   *         - email
   *         - verificationCode
   *       properties:
   *         email:
   *           type: string
   *           format: email
   *           example: user@example.com
   *         verificationCode:
   *           type: string
   *           example: "123456"
   */

  async verifyEmail(req, res) {
    try {
      const { email, verificationCode } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found", data: user });
      }

      // const EXPIRATION_TIME = 5 * 60 * 1000; //5 menit
      const EXPIRATION_TIME = 1 * 60 * 1000; //1 menit

      const createdAt = new Date(user.verificationCodeCreatedAt).getTime();
      const now = Date.now();

      if (now - createdAt > EXPIRATION_TIME) {
        return res.status(400).json({ message: "Verification code expired" });
      }

      console.log("Stored:", user.verificationCode, "Input:", verificationCode);

      if (user.verificationCode !== verificationCode.toString()) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      user.isVerified = true;
      user.verificationCode = null; // hapus code biar tidak bisa dipakai ulang
      await user.save();
      res.status(200).json({ message: "Email successfully verified!" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async login(req, res) {
    /**
       #swagger.requestBody = {
       required: true,
       schema: {
       $ref: "#components/schemas/LoginRequest"}
       }
       
       */
    try {
      const { identifier, password } = req.body;
      const userByIdentifier = await User.findOne({
        where: {
          [Op.or]: [{ username: identifier }, { email: identifier }],
        },
      });

      // validasi identifier
      if (!userByIdentifier) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }
      // validasi isVerified
      if (!userByIdentifier.isVerified) {
        return res.status(403).json({
          message: "User is not verified yet",
          data: null,
        });
      }

      // validasi password
      const validatePassword = await bcrypt.compare(
        password,
        userByIdentifier.password
      );

      if (!validatePassword) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      const token = jwt.sign(
        {
          id: userByIdentifier.id,
          role: userByIdentifier.role,
        },
        process.env.SECRET || "default_secret",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login success",
        data: {
          token: token,
          isVerified: userByIdentifier?.isVerified,
        },
      });
    } catch (error) {
      const err = error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req, res) {
    /**
      #swagger.security = [{
       "bearerAuth": []
       }]
       */
    try {
      const user = req.user;
      const result = await User.findOne({
        where: { id: user?.id },
      });

      res.status(200).json({
        message: "Success get user profile",
        data: result,
      });
    } catch (error) {
      const err = error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const Yup = require("yup");
const { Op } = require("sequelize");
const sendEmailVerification = require("../service/email.service");
// const { v4: uuidv4 } = require("uuid");
const { generateVerificationCode } = require("../utils/verificationCode");
const registerValidateModels = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Password not match"),
  roleId: Yup.string().uuid("Invalid role format").required("Role is required"),
});

module.exports = {
  async register(req, res) {
    /**
      #swagger.tags = ['Auth']
     */
    const { fullName, username, email, password, confirmPassword, roleId } =
      req.body;
    try {
      await registerValidateModels.validate({
        fullName,
        username,
        email,
        password,
        roleId,
        confirmPassword,
      });

      // check existing username and email
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        const field = existingUser.email === email ? "Email" : "Username";
        return res.status(400).json({
          message: `${field} Already Exist`,
          data: null,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = generateVerificationCode();
      const verificationCodeCreatedAt = new Date();
      const result = await User.create({
        fullName,
        username,
        email,
        password: hashedPassword,
        roleId,
        verificationCode,
        verificationCodeCreatedAt,
        isVerified: false,
      });
      await sendEmailVerification(email, verificationCode);
      res.status(200).json({
        message:
          "Success Registration! Please check your email for verification code.",
        data: {
          fullName,
          username,
          email,
          roleId,
        },
      });
    } catch (error) {
      console.log("Error validate register: ", error);
      res.status(500).json({
        message: error.message,
        data: null,
      });
    }
  },

  async resendVerificationCode(req, res) {
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
     */
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

  async verifyEmail(req, res) {
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
    try {
      const { email, verificationCode } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found", data: user });
      }

      const EXPIRATION_TIME = 60 * 60 * 1000; //1 menit

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
     * @swagger
     * components:
     *   schemas:
     *     LoginRequest:
     *       type: object
     *       required:
     *         - identifier
     *         - password
     *       properties:
     *         identifier:
     *           type: string
     *           example: "ahmadherkal"
     *         password:
     *           type: string
     *           example: "1234"
     */

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       200:
     *         description: Login successful
     *       400:
     *         description: Bad request
     *       403:
     *         description: Incorrect credentials or unverified
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
      console.log("Input Password:", password);
      console.log("DB Password:", userByIdentifier.password);
      // validasi password
      // const validatePassword = await bcrypt.compare(
      //   password,
      //   userByIdentifier.password,
      // );

      // untuk sementara
      const validatePassword = password === userByIdentifier.password;

      if (!validatePassword) {
        return res.status(403).json({
          message: "Incorrect email or password",
          data: null,
        });
      }

      const role = await Role.findOne({
        where: { id: userByIdentifier.roleId },
      });

      if (!role) {
        return res.status(403).json({
          message: "Role not found",
          data: null,
        });
      }

      const payload = {
        UserInfo: {
          id: userByIdentifier.id,
          username: userByIdentifier.username,
          role: role.name,
        },
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
        expiresIn: "12h",
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
        expiresIn: "1d",
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: false, //  untuk development
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
      });

      res.status(200).json({
        status: 200,
        message: "Login success",
        results: {
          id: userByIdentifier?.id,
          isVerified: userByIdentifier?.isVerified,
          role: role.name,
          username: userByIdentifier.username,
          token: accessToken,
          refreshToken: refreshToken,
        },
      });

      console.log("User logined: ", userByIdentifier.username);
    } catch (error) {
      const err = error;
      res.status(500).json({
        message: err.message,
        data: null,
      });
    }
  },

  // refresh
  async refresh(req, res) {
    /**
     * #swagger.security = [{
     * "bearerAuth": []
     * }]
     **/
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const refreshToken = cookies.jwt;

      // Verifikasi refresh token
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Forbidden" });
          }

          const foundUser = await User.findOne({
            where: { id: decoded.UserInfo.id },
          });

          if (!foundUser) {
            console.log("Gagal refresh");
            return res.status(401).json({ message: "Unauthorized" });
          }

          // Buat access token baru
          const accessToken = jwt.sign(
            {
              UserInfo: {
                id: foundUser.id,
                role: foundUser.role,
              },
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: "12h" },
          );

          console.log("Cookies:", req.cookies);
          console.log("Decoded refresh:", decoded);
          console.log("Cookies di /auth/refresh:", req.cookies);
          console.log("User found in DB:", foundUser);

          res.status(200).json({
            message: "Success refresh token",
            token: accessToken,
          });
        },
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
      });
    }
  },

  /**
      #swagger.security = [{
       "bearerAuth": []
       }]
       */
  async me(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) return res.sendStatus(401);

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

      const user = await User.findOne({
        where: { username: decoded.UserInfo.username },
        attributes: { exclude: ["password"] },
      });

      if (!user) return res.sendStatus(404);

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async logout(req, res) {
    try {
      const cookies = req.cookies;

      if (!cookies?.jwt) {
        return res.sendStatus(204); // No content, no cookie to clear
      }

      // Kalau ada cookie, decode dan log user
      const decoded = jwt.decode(cookies.jwt);
      console.log("User logout:", decoded?.UserInfo?.username);

      // Clear cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: false,
      });
      console.log("Logout success, cookie cleared ==================");
      return res.status(200).json({
        message: "Logout success, cookie cleared",
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },
};

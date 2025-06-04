const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Yup = require("yup");
const { Op } = require("sequelize");
const registerValidateModels = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Password not match"),
});
module.exports = {
  async register(req, res) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { fullName, username, email, password, confirmPassword } = req.body;
    try {
      await registerValidateModels.validate({
        fullName,
        username,
        email,
        password: hashedPassword,
        confirmPassword,
      });

      const result = await User.create({
        fullName,
        username,
        email,
        password: hashedPassword,
      });

      res.status(200).json({
        message: "Success Registration!",
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

  async login(req, res) {
    /**
       #swagger.requestBody = {
       required: true,
       schema: {
       $ref: "#components/schemas/LoginRequest"}
       }
       
       */
    const { identifier, password } = req.body;
    try {
      const userByIdentifier = await User.findByPk({
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
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1d" }
      );
      res.status(200).json({
        message: "Login success",
        data: token,
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
      const result = await User.findByPk(user?.id);

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

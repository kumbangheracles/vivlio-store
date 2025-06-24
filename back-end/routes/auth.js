const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk otentikasi user
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - username
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         fullName:
 *           type: string
 *           example: John Doe
 *         username:
 *           type: string
 *           example: johndoe
 *         role:
 *           type: string
 *           example: admin
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: secret123
 *         confirmPassword:
 *           type: string
 *           example: secret123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - identifier
 *         - password
 *       properties:
 *         identifier:
 *           type: string
 *           example: johndoe
 *         password:
 *           type: string
 *           example: secret123
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Registrasi berhasil
 *       400:
 *         description: Validasi gagal atau error
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/resend-code-verification:
 *   post:
 *     summary: Resend Email Verification Code
 *     description: Mengirim ulang kode verifikasi ke email pengguna yang belum diverifikasi.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendVerificationCodeRequest'
 *           example:
 *             email: user@example.com
 *     responses:
 *       200:
 *         description: Kode verifikasi berhasil dikirim ulang
 *         content:
 *           application/json:
 *             example:
 *               message: Verification code resent successfully
 *               data:
 *                 email: user@example.com
 *                 verificationCodeSentAt: 2025-06-05T15:30:00.000Z
 *       400:
 *         description: Permintaan tidak valid (e.g. email tidak ditemukan atau user sudah diverifikasi)
 *       500:
 *         description: Terjadi kesalahan server saat mengirim ulang kode
 */

router.post("/resend-code-verification", authController.resendVerificationCode);
/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify Email
 *     description: Verifikasi email pengguna menggunakan kode OTP yang dikirim ke email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *           example:
 *             email: user@example.com
 *             verificationCode: "123456"
 *     responses:
 *       200:
 *         description: Verifikasi email berhasil
 *         content:
 *           application/json:
 *             example:
 *               message: Email berhasil diverifikasi
 *               data:
 *                 email: user@example.com
 *                 verifiedAt: 2025-06-05T15:30:00.000Z
 *       400:
 *         description: Permintaan tidak valid (e.g. OTP tidak sesuai atau kedaluwarsa)
 *       403:
 *         description: Kode OTP salah, silakan coba kembali
 */
router.post("/verify-email", authController.verifyEmail);
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
 *         description: Login berhasil
 *       403:
 *         description: User tidak ditemukan atau password salah
 */
router.post("/login", authController.login);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil user
 *       401:
 *         description: user tidak
 *       403:
 *         description: Token tidak valid
 */
router.get("/me", authMiddleware, authController.me);
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: refresh token user yg sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User yang sedang login
 *       400:
 *         description: Token tidak ada
 *       403:
 *         description: Token tidak valid
 */
router.get("/refresh", authMiddleware, authController.refresh);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout berhasil
 */

router.post("/logout", authController.logout);

module.exports = router;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailVerification(email, code) {
  await transporter.sendMail({
    from: `"Herkal App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    html: `<p>Hello! Here's your verification code: <b>${code}</b></p>`,
  });
}

module.exports = sendEmailVerification;

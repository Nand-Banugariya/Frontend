const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to another service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send verification email to user
 * @param {string} to - recipient email
 * @param {string} token - verification token
 * @param {string} username - username of recipient
 */
const sendVerificationEmail = async (to, token, username) => {
  const verificationUrl = `${
    process.env.FRONTEND_URL || "http://localhost:8080"
  }/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Bharat Heritage - Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #fb923c;">Bharat Heritage</h2>
        </div>
        <div style="margin-bottom: 30px;">
          <h3>Hello ${username},</h3>
          <p>Thank you for registering with Bharat Heritage. Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #fb923c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #4a5568;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 14px; color: #718096;">
          <p>If you did not create an account with Bharat Heritage, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
};

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    user = new User({
      username,
      email,
      password,
      interests: [],
      bookmarks: [],
      contributions: [],
      badges: [],
      verificationToken,
      verificationTokenExpires,
      isVerified: false,
    });

    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      verificationToken,
      username
    );

    if (!emailSent) {
      // If email sending fails, still create account but notify user
      console.error("Verification email could not be sent");
    }

    // Send response without token (user must verify email first)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
    };

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Email verification route
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with this verification token and token not expired
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired verification token. Please request a new verification email.",
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Create JWT token
    const authToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Email verified successfully. You can now log in.",
      token: authToken,
      success: true,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      verificationToken,
      user.username
    );

    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.json({ message: "Verification email has been sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res
      .status(500)
      .json({ message: "Server error while resending verification" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        needsVerification: true,
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Send response without password
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      interests: user.interests,
      bookmarks: user.bookmarks,
      contributions: user.contributions,
      badges: user.badges,
      isVerified: user.isVerified,
    };

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;

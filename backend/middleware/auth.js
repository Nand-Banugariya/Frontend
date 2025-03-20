const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("Authorization");

  // Check if no token
  if (!token) {
    console.log("Auth middleware: No token provided");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Split the token if it has Bearer prefix
    const tokenValue = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    // Verify token
    console.log("Auth middleware: Attempting to verify token");
    const decoded = jwt.verify(
      tokenValue,
      process.env.JWT_SECRET || "your-secret-key"
    );
    console.log("Auth middleware: Token verified successfully");

    // Set user from payload
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

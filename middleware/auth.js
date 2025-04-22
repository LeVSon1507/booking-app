const jwt = require("jsonwebtoken");

/**
 * Authentication middleware to protect routes
 * Verifies JWT tokens and attaches user data to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      { algorithms: ["HS256"] },
      (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              success: false,
              message: "Authentication token has expired",
            });
          }

          if (err.name === "JsonWebTokenError") {
            return res.status(403).json({
              success: false,
              message: "Invalid authentication token",
            });
          }

          return res.status(403).json({
            success: false,
            message: "Token verification failed",
          });
        }

        req.user = decoded;
        next();
      }
    );
  } catch (err) {
    console.error("Authentication middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};

module.exports = protect;

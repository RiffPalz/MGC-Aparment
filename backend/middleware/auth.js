import { verifyAccessToken } from "../utils/token.js";

// Check if the user is logged in by verifying their token
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for the Bearer token in headers
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // Save user info (ID, role) to the request object
    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check if the logged-in user has the right role (e.g., 'admin' or 'tenant')
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure the user was authenticated first
    if (!req.auth || !req.auth.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Block access if the user's role isn't in the allowed list
    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
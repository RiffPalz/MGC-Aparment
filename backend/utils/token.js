import jwt from "jsonwebtoken";
import crypto from "crypto";

// Create a JWT for user sessions (Admin, Caretaker, or Tenant)
export const generateAccessToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

// Check if a JWT is valid and decode its data
export const verifyAccessToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate a random 64-character string for session tracking
export const generateLoginToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate a random 64-character string for password reset links
export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export default {
  generateAccessToken,
  verifyAccessToken,
  generateLoginToken,
  generatePasswordResetToken,
};
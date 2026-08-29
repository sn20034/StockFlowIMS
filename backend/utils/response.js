import jwt from "jsonwebtoken";

export const sendResponse = (
  res,
  { success = true, data = null, message = "", statusCode = 200 },
) => {
  return res.status(statusCode).json({ success, data, message });
};

export const sendError = (res, message, statusCode = 400, data = null) => {
  return res.status(statusCode).json({ success: false, data, message });
};

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "fallback_jwt_secret_key_12345";
  return jwt.sign({ id: userId }, secret, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId) => {
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || "fallback_jwt_refresh_secret_key_67890";
  return jwt.sign({ id: userId }, refreshSecret, { expiresIn: "7d" });
};

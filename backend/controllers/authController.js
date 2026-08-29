import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import {
  generateToken,
  generateRefreshToken,
  sendResponse,
  sendError,
} from "../utils/response.js";
import {
  generateVerificationToken,
  sendVerificationEmail,
} from "../utils/email.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, "Email already registered", 409);
    }

    const verificationToken = generateVerificationToken();

    const user = await User.create({
      name,
      email,
      password,
      role: role || "staff",
      isVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(email, name, verificationToken);

    return sendResponse(res, {
      statusCode: 201,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      message:
        "Account created. Please check your email to verify your account.",
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    if (!user.password) {
      return sendError(
        res,
        "This account uses Google Sign-In. Please continue with Google.",
        400,
      );
    }

    if (!user.isVerified) {
      return sendError(res, "Please verify your email before logging in", 403);
    }

    const matched = await user.matchPassword(password);
    if (!matched) {
      return sendError(res, "Invalid email or password", 401);
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return sendResponse(res, {
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, email_verified } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: !!email_verified,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (email_verified) user.isVerified = true;
      await user.save();
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return sendResponse(res, {
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      message: "Google login successful",
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return sendError(res, "Google authentication failed", 401);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    }).select("+verificationToken +verificationTokenExpires");

    if (!user) {
      return sendError(res, "Invalid or expired verification link", 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return sendResponse(res, { message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, "No account found with this email", 404);
    }
    if (user.isVerified) {
      return sendError(res, "Email already verified", 400);
    }

    const verificationToken = generateVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(email, user.name, verificationToken);

    return sendResponse(res, { message: "Verification email resent" });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return sendResponse(res, {
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      message: "User profile",
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    return sendResponse(res, { message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, "Refresh token required", 400);
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, "Invalid refresh token", 401);
    }
    const accessToken = generateToken(user._id);
    return sendResponse(res, {
      data: { accessToken },
      message: "Token refreshed",
    });
  } catch (err) {
    return sendError(res, "Invalid refresh token", 401);
  }
};

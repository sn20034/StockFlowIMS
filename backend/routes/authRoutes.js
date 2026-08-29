import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  googleAuth,
  verifyEmail,
  resendVerification,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["admin", "staff"])
      .withMessage("Invalid role"),
  ],
  validateRequest,
  register,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login,
);

router.post("/google", googleAuth);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.post("/refresh", refreshToken);

export default router;

import express from "express";
import { forgotPassword, resetPassword } from "../controllers/authController.js";
import {
  forgotPasswordRateLimiter,
  loginRateLimiter,
  otpVerificationRateLimiter,
  resetPasswordRateLimiter,
  signupRateLimiter,
} from "../middlewares/rateLimiter.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { forgotPasswordSchema, resetPasswordSchema } from "../validations/schemas.js";

const router = express.Router();

export const authRouteRateLimiters = {
  loginRateLimiter,
  signupRateLimiter,
  otpVerificationRateLimiter,
};

router.post("/forgot-password", forgotPasswordRateLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", resetPasswordRateLimiter, validateRequest(resetPasswordSchema), resetPassword);
router.post("/login", loginRateLimiter, (req, res) => {
  res.json({ message: "Login route working" });
});

export default router;
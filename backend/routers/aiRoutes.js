import express from "express";

import {
  askAI,
  generateSessionSummary,
} from "../controllers/aiController.js";

import { requireAuth, requireProfileRole } from "../middlewares/requireAuth.js";
import { protectedApiRateLimiter } from "../middlewares/rateLimiter.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { askAISchema, generateSummarySchema } from "../validations/schemas.js";

const router = express.Router();

/**
 * AI chat endpoint (secured version from main)
 */
router.post(
  "/ask",
  requireAuth,
  requireProfileRole("mentor", "learner"),
  protectedApiRateLimiter,
  validateRequest(askAISchema),
  askAI
);

/**
 * Session summary generator (new feature)
 */
router.post(
  "/generate-summary",
  requireAuth,
  requireProfileRole("mentor", "learner"),
  protectedApiRateLimiter,
  validateRequest(generateSummarySchema),
  generateSessionSummary
);

export default router;
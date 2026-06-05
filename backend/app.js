import express from "express";
import { randomUUID } from "crypto";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import chatRoutes from "./routers/chatRoutes.js";
import aiRoutes from "./routers/aiRoutes.js";
import matchRoutes from "./routers/matchRoutes.js";
import authRoutes from "./routers/authRoutes.js";
import cronRoutes from "./routers/cronRoutes.js";
import notificationRoutes from "./routers/notificationRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// SECURITY: Only trust proxy headers when explicitly configured.
if (process.env.TRUSTED_PROXIES) {
  app.set("trust proxy", process.env.TRUSTED_PROXIES.split(",").map(s => s.trim()));
  console.log(`[security] trust proxy enabled for subnets: ${process.env.TRUSTED_PROXIES}`);
} else if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
  console.warn("[security] trust proxy enabled with hop-count 1. Consider setting TRUSTED_PROXIES for explicit subnet whitelisting.");
}

const ALLOWED_ORIGINS = process.env.FRONTEND_URL;

if (!ALLOWED_ORIGINS) {
  console.error('❌ FRONTEND_URL environment variable is required');
  process.exit(1);
}

app.use(cors({
  origin: ALLOWED_ORIGINS.split(',').map(url => url.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestId = req.headers["x-request-id"] || randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for AI to prevent OPENROUTER_API_KEY exhaustion
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 AI requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
app.use("/api/ai", aiLimiter);

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/cron", cronRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

export default app;

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;
const MAX_ENTRIES = 10000;
const CLEANUP_INTERVAL_MS = 60 * 1000;

const requestCounts = new Map();

const evictStaleEntries = () => {
  const now = Date.now();
  for (const [key, entry] of requestCounts.entries()) {
    if (now - entry.windowStart >= WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
};

setInterval(evictStaleEntries, CLEANUP_INTERVAL_MS);

export const rateLimiter = (req, res, next) => {
  const userId = req.user?.id || req.ip;
  const now = Date.now();

  if (requestCounts.size >= MAX_ENTRIES) {
    evictStaleEntries();
  }

  const entry = requestCounts.get(userId);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    requestCounts.set(userId, { count: 1, windowStart: now });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too many requests. Please wait before sending more messages.",
    });
  }

  entry.count += 1;
  next();
};

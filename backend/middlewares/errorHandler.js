import { ZodError } from "zod";

/**
 * Global error handling middleware for Express.
 * Placed at the end of the middleware stack to catch unhandled errors.
 */
export const errorHandler = (err, req, res, next) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: formattedErrors,
    });
  }

  // Log server errors for debugging (can be replaced with Winston/Pino)
  if (process.env.NODE_ENV !== "test") {
    console.error(`[Error] ${err.name}:`, err.message);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  // Handle expected errors that have a status code attached
  const statusCode = err.status || err.statusCode || 500;
  
  // Format standard API error response
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

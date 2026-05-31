/**
 * Wraps an async Express route handler to automatically catch promise rejections
 * and pass them to the Express error handler via next().
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

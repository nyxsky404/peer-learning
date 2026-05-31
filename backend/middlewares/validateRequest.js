import { ZodError } from "zod";

/**
 * Express middleware to validate req.body, req.query, or req.params using a Zod schema.
 * Supports taking an object like { body: schema } or just a schema assuming it's for the body.
 */
export const validateRequest = (schema) => (req, res, next) => {
  try {
    // If schema is an object with body, query, or params keys, validate them individually
    if (schema.body || schema.query || schema.params) {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.query) req.query = schema.query.parse(req.query);
      if (schema.params) req.params = schema.params.parse(req.params);
    } else {
      // Otherwise assume it's just a body schema
      req.body = schema.parse(req.body);
    }
    next();
  } catch (error) {
    next(error);
  }
};

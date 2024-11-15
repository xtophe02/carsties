import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error("Error caught in middleware:", { error: err });

  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      error: "Database operation failed",
      details: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: err.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

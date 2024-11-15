import express from "express";
import rateLimit from "express-rate-limit";
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import "./config/logger.js";
import "dotenv/config";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 7002;

const app = express();

// Middleware
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/auth", limiter);

// Routes
app.use("/api/auth", authRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

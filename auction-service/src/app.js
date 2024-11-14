import express from "express";
import cors from "cors";
import auctionRoutes from "./routes/auctionRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./config/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`, {
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
});

app.use("/api/auctions", auctionRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;

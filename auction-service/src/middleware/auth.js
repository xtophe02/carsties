import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.error("Authentication failed: No token provided");
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication failed: Invalid token", { error });
    return res.status(403).json({ error: "Invalid token" });
  }
};

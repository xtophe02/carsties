import { verifyToken } from "../utils/jwt.utils.js";
import { getUserById } from "../controllers/auth.controller.js";
import logger from "../config/logger.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

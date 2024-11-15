import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const generateToken = ({ userId, email, username }) => {
  logger.debug("Generating token for user:", { userId, username, email });
  return jwt.sign({ userId, email, username }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.utils.js";
import { hashPassword, comparePasswords } from "../utils/password.utils.js";
import logger from "../config/logger.js";

export const signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, username, passwordHash },
    });

    const token = generateToken({ userId: user.id, email, username });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    logger.error("Signup error:", error);
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await comparePasswords(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      email,
      username: user.username,
    });

    res.json({
      message: "Signed in successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    logger.error("Signin error:", error);
    next(error);
  }
};

export const signout = (req, res) => {
  // Client-side token removal
  res.json({ message: "Signed out successfully" });
};

export const getProfile = async (req, res, next) => {
  try {
    // req.user is set by authenticate middleware
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
      },
    });
  } catch (error) {
    logger.error("Get profile error:", error);
    next(error);
  }
};

export const getUserById = async (id) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    logger.error("Get user by ID error:", error);
    throw error;
  }
};

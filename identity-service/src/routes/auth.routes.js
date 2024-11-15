import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", authController.signout);
router.get("/me", authenticate, authController.getProfile);

export { router as authRouter };

import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import * as auctionController from "../controllers/auctionController.js";

const router = express.Router();

router.post("/", authenticateToken, auctionController.createAuction);
router.put("/:id", authenticateToken, auctionController.updateAuction);
router.delete("/:id", authenticateToken, auctionController.deleteAuction);
router.get("/", auctionController.getAuctions);
router.get("/:id", auctionController.getAuctionById);

export default router;

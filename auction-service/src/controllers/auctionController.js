import prisma from "../config/prisma.js";
import logger from "../config/logger.js";
// import { eventBus } from "../events/eventBus.js";

export async function createAuction(req, res) {
  const {
    make,
    model,
    year,
    mileage,
    color,
    imageUrl,
    reservePrice,
    auctionEnd,
  } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create the item first
      const item = await tx.item.create({
        data: {
          make,
          model,
          year,
          mileage,
          color,
          imageUrl,
        },
      });

      // Create the auction with the item reference
      const auction = await tx.auction.create({
        data: {
          itemId: item.id,
          reservePrice,
          auctionEnd: new Date(auctionEnd),
          seller: req.user.username,
        },
        include: {
          item: true,
        },
      });

      return auction;
    });

    // await eventBus.publishEvent("auction.created", result);
    res.status(201).json(result);
  } catch (error) {
    logger.error("Error creating auction:", error);
    res.status(500).json({ error: "Error creating auction" });
  }
}

export async function getAuctions(req, res) {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        item: true,
      },
    });
    res.json(auctions);
  } catch (error) {
    logger.error("Error fetching auctions:", error);
    res.status(500).json({ error: "Error fetching auctions" });
  }
}

export async function getAuctionById(req, res) {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: req.params.id },
      include: { item: true },
    });

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    res.json(auction);
  } catch (error) {
    logger.error("Error fetching auction:", error);
    res.status(500).json({ error: "Error fetching auction" });
  }
}

export async function updateAuction(req, res) {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: req.params.id },
    });

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    if (auction.seller !== req.user.username) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedAuction = await prisma.auction.update({
      where: { id: req.params.id },
      data: req.body,
      include: { item: true },
    });

    // await eventBus.publishEvent("auction.updated", updatedAuction);
    res.json(updatedAuction);
  } catch (error) {
    logger.error("Error updating auction:", error);
    res.status(500).json({ error: "Error updating auction" });
  }
}

export async function deleteAuction(req, res) {
  try {
    const { id } = req.params;
    const auction = await auctionService.getAuctionById(id);

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    if (auction.seller !== req.user.username) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete the item (cascade will handle the auction)
    await prisma.item.delete({
      where: { id: auction.itemId },
    });

    // await eventBus.publishEvent("auction.deleted", {
    //   id: req.params.id,
    //   itemId: auction.itemId,
    // });

    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting auction:", error);
    res.status(500).json({ error: "Error deleting auction" });
  }
}

export async function getAuctionsFromDate(req, res) {
  try {
    const date = new Date(req.params.date);

    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const auctions = await prisma.auction.findMany({
      where: {
        updatedAt: {
          gte: date,
        },
      },
      include: { item: true },
    });

    res.json(auctions);
  } catch (error) {
    logger.error("Error fetching auctions by date:", error);
    res.status(500).json({ error: "Error fetching auctions" });
  }
}

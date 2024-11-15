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
    // logger.debug(JSON.stringify(auctions));
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
    const { id } = req.params;
    logger.info(`Updating auction with ID: ${id}`);
    logger.debug(`Update payload:`, req.body);

    // First, verify the auction exists and user has permission
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { item: true },
    });

    logger.debug(`Found auction:`, auction);

    if (!auction) {
      logger.warn(`Auction not found with ID: ${id}`);
      return res.status(404).json({ error: "Auction not found" });
    }

    if (auction.seller !== req.user.username) {
      logger.warn(`Unauthorized update attempt by user: ${req.user.username}`);
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Only allow specific item fields
    const allowedFields = ["make", "model", "color", "mileage", "year"];
    const itemUpdate = {};

    // Only include fields that are present in the request and allowed
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        itemUpdate[field] = req.body[field];
      }
    });

    logger.debug(`Item update payload:`, itemUpdate);

    // Only update if there are valid fields to update
    if (Object.keys(itemUpdate).length === 0) {
      logger.warn("No valid fields to update");
      return res.status(400).json({
        error:
          "No valid fields to update. Allowed fields: make, model, color, mileage, year",
      });
    }

    // Update the item
    const updatedItem = await prisma.item.update({
      where: { id: auction.itemId },
      data: itemUpdate,
    });

    logger.info(`Successfully updated item for auction ${id}`);
    logger.debug(`Updated item:`, updatedItem);

    // Return the full auction with updated item
    const result = await prisma.auction.findUnique({
      where: { id },
      include: { item: true },
    });

    res.json(result);
  } catch (error) {
    logger.error("Error updating auction:", error);
    res.status(500).json({
      error: "Error updating auction",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export async function deleteAuction(req, res) {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: req.params.id },
    });
    logger.debug(JSON.stringify(auction));
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

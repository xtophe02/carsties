import { PrismaClient } from "@prisma/client";
import logger from "./logger.js";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
  ],
});

// Log queries in development
prisma.$on("query", (e) => {
  logger.debug("Query: " + e.query);
});

// Log errors
prisma.$on("error", (e) => {
  logger.error("Prisma Error: " + e.message);
});

// Initialize connection
async function initializePrisma() {
  try {
    await prisma.$connect();
    logger.info("Database connection established");
  } catch (error) {
    logger.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

// Initialize connection when this module is imported
initializePrisma();

export default prisma;

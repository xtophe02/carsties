# Stage 1: Base development environment
FROM node:18 AS development
# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
# Install all dependencies, including Prisma CLI
RUN npm install
# Copy the application source code to the container
COPY . .
# Generate Prisma Client
RUN npm run prisma:generate
EXPOSE 7002
# Default command for development
CMD ["npm", "run", "dev"]

# Stage 2: Production environment
FROM node:18 AS production
# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install only production dependencies (Prisma Client included, but Prisma CLI not required)
RUN npm install --only=production
# Copy Prisma schema and generate the Prisma Client
COPY prisma ./prisma
RUN npm run prisma:generate
# Copy the application code, excluding dev files
COPY . .
EXPOSE 7002
# Command to run the application in production
CMD ["npm", "run", "start"]

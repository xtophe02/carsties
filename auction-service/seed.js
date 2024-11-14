import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // First, delete all existing records
  await prisma.auction.deleteMany({});
  await prisma.item.deleteMany({});

  console.log("Deleted existing records");

  const auctions = [
    {
      id: "afbee524-5972-4075-8800-7d1f9d7b0a0c",
      status: "LIVE",
      reservePrice: 20000,
      seller: "bob",
      auctionEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Ford",
          model: "GT",
          color: "White",
          mileage: 50000,
          year: 2020,
          imageUrl:
            "https://cdn.pixabay.com/photo/2016/05/06/16/32/car-1376190_960_720.jpg",
        },
      },
    },
    {
      id: "c8c3ec17-01bf-49db-82aa-1ef80b833a9f",
      status: "LIVE",
      reservePrice: 90000,
      seller: "alice",
      auctionEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Bugatti",
          model: "Veyron",
          color: "Black",
          mileage: 15035,
          year: 2018,
          imageUrl:
            "https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_960_720.jpg",
        },
      },
    },
    {
      id: "bbab4d5a-8565-48b1-9450-5ac2a5c4a654",
      status: "LIVE",
      seller: "bob",
      reservePrice: 20000,
      auctionEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Ford",
          model: "Mustang",
          color: "Black",
          mileage: 65125,
          year: 2023,
          imageUrl:
            "https://cdn.pixabay.com/photo/2012/11/02/13/02/car-63930_960_720.jpg",
        },
      },
    },
    {
      id: "155225c1-4448-4066-9886-6786536e05ea",
      status: "RESERVE_NOT_MET",
      reservePrice: 50000,
      seller: "tom",
      auctionEnd: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Mercedes",
          model: "SLK",
          color: "Silver",
          mileage: 15001,
          year: 2020,
          imageUrl:
            "https://cdn.pixabay.com/photo/2016/04/17/22/10/mercedes-benz-1335674_960_720.png",
        },
      },
    },
    {
      id: "466e4744-4dc5-4987-aae0-b621acfc5e39",
      status: "LIVE",
      reservePrice: 20000,
      seller: "alice",
      auctionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "BMW",
          model: "X1",
          color: "White",
          mileage: 90000,
          year: 2017,
          imageUrl:
            "https://cdn.pixabay.com/photo/2017/08/31/05/47/bmw-2699538_960_720.jpg",
        },
      },
    },
    {
      id: "dc1e4071-d19d-459b-b848-b5c3cd3d151f",
      status: "LIVE",
      reservePrice: 20000,
      seller: "bob",
      auctionEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Ferrari",
          model: "Spider",
          color: "Red",
          mileage: 50000,
          year: 2015,
          imageUrl:
            "https://cdn.pixabay.com/photo/2017/11/09/01/49/ferrari-458-spider-2932191_960_720.jpg",
        },
      },
    },
    {
      id: "47111973-d176-4feb-848d-0ea22641c31a",
      status: "LIVE",
      reservePrice: 150000,
      seller: "alice",
      auctionEnd: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Ferrari",
          model: "F-430",
          color: "Red",
          mileage: 5000,
          year: 2022,
          imageUrl:
            "https://cdn.pixabay.com/photo/2017/11/08/14/39/ferrari-f430-2930661_960_720.jpg",
        },
      },
    },
    {
      id: "6a5011a1-fe1f-47df-9a32-b5346b289391",
      status: "LIVE",
      seller: "bob",
      reservePrice: 80000,
      auctionEnd: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Audi",
          model: "R8",
          color: "White",
          mileage: 10050,
          year: 2021,
          imageUrl:
            "https://cdn.pixabay.com/photo/2019/12/26/20/50/audi-r8-4721217_960_720.jpg",
        },
      },
    },
    {
      id: "40490065-dac7-46b6-acc4-df507e0d6570",
      status: "LIVE",
      reservePrice: 20000,
      seller: "tom",
      auctionEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Audi",
          model: "TT",
          color: "Black",
          mileage: 25400,
          year: 2020,
          imageUrl:
            "https://cdn.pixabay.com/photo/2016/09/01/15/06/audi-1636320_960_720.jpg",
        },
      },
    },
    {
      id: "3659ac24-29dd-407a-81f5-ecfe6f924b9b",
      status: "LIVE",
      reservePrice: 20000,
      seller: "bob",
      auctionEnd: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000),
      item: {
        create: {
          make: "Ford",
          model: "Model T",
          color: "Rust",
          mileage: 150150,
          year: 1938,
          imageUrl:
            "https://cdn.pixabay.com/photo/2017/08/02/19/47/vintage-2573090_960_720.jpg",
        },
      },
    },
  ];

  // Use transaction to ensure all inserts succeed or none do
  await prisma.$transaction(async (tx) => {
    for (const auctionData of auctions) {
      await tx.auction.create({
        data: auctionData,
      });
    }
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    const tracks = [
      { name: "Track 1" },
      { name: "Track 2" },
      { name: "Track 3" },
      { name: "Track 4" },
      { name: "Track 5" },
      { name: "Track 6" },
      { name: "Track 7" },
      { name: "Track 8" },
      { name: "Track 9" },
      { name: "Track 10" },
      { name: "Track 11" },
      { name: "Track 12" },
      { name: "Track 13" },
      { name: "Track 14" },
      { name: "Track 15" },
      { name: "Track 16" },
      { name: "Track 17" },
      { name: "Track 18" },
      { name: "Track 19" },
      { name: "Track 20" },
    ];
  
    await prisma.track.createMany({ data: tracks });
  
    console.log("Tracks seeded successfully!");
  }
  
  seed()
    .catch((e) => {
      console.error("Error seeding database:", e);
      process.exit(1); 
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

seed();
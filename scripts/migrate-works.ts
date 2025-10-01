import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

// Import the static works data
const works = [
  {
    slug: "lexus-gias",
    name: "GIIAS 2021-2025 ",
    logo: "/images/Client/Lexus.png",
    year: "2025",
    img: "/images/work/lexus/banners.jpg",
    description: "In GIIAS Lexus present its latest in luxury and innovation - featuring new models advanced technology, and warm Omotenashi hospitality, complete with special menu to make every guest feel at home",
    gallery: [
      "/images/work/lexus/1.jpg",
      "/images/work/lexus/2.jpg",
      "/images/work/lexus/3.jpg",
      "/images/work/lexus/4.jpg",
      "/images/work/lexus/6.jpg",
      "/images/work/lexus/7.jpg",
    ],
  },
  {
    slug: "telkomsel-dinner",
    name: "Welcoming Dinner Bali",
    logo: "/images/Client/telkomsel.png",
    year: "2025",
    img: "/images/work/telkomsel/banner.jpg",
    description: "The Welcoming Dinner Bali 2025 was a sophisticated evening hosted by Telkomsel to warmly greet its distinguished guests and partners. Serving as the opening to a larger series of events, the dinner needed to strike a delicate balance between elegance, cultural authenticity, and a seamless guest experience.One of the main challenges was transforming a scenic Bali venue into a space that reflected both Telkomsel's prestige and the island's cultural richness, all while accommodating high-profile attendees with diverse expectations. From curating the program flow to orchestrating stage design, fine dining experiences, and local performances, every detail required precision and harmony.Trimar Production brought its expertise to the forefront leveraging years of experience in crafting corporate and luxury events. By combining elegant staging with immersive cultural elements, our team delivered not only a beautiful evening but also a meaningful introduction that set the tone for the days ahead. The result was a welcoming dinner that left guests feeling valued, inspired, and fully engaged from the very start.",
    gallery: [
      "/images/work/telkomsel/1.jpg",
      "/images/work/telkomsel/2.jpg",
      "/images/work/telkomsel/3.jpg",      
      "/images/work/telkomsel/4.jpg",
      "/images/work/telkomsel/5.jpg",
      "/images/work/telkomsel/6.jpg",
    ],
  },
  {
    slug: "asn-kickoff",
    name: "Allianz ASN Kick Off",
    logo: "/images/Client/allianz.png",
    year: "2021",
    img: "/images/work/allianz/banner.jpg",
    description: "Trimar Production transformed Allianz : ASN Kick Off into a groundbreaking virtual experience, adapting to the challenges of the pandemic with creativity and innovation. Instead of a traditional gathering, the event went fully online, yet retained the excitement and energy of a live show. A highlight of the production was the use of interactive projection mapping on dresses, a visual spectacle that elevated the digital stage and kept the audience engaged throughout. Combined with seamless streaming, dynamic presentations, and inspiring content, the event proved that even in a virtual format, a kick-off can be both captivating and memorable.",
    gallery: [
      "/images/work/allianz/1.jpg",
      "/images/work/allianz/2.jpg",
      "/images/work/allianz/3.jpg",      
      "/images/work/allianz/4.jpg",
      "/images/work/allianz/5.jpg",
      "/images/work/allianz/6.jpg",
    ],
  },
  {
    slug: "mandiri-imlek",
    name: "Mandiri Lunar New Year 2573",
    logo: "/images/Client/mandiri.png",
    year: "2022",
    img: "/images/work/mandiri/banner.jpg",
    description: "A festive celebration with elegant Chinese cultural touches, lively performances, and a memorable atmosphere crafted by Trimar Production. Trimar Production successfully organized Mandiri's Lunar New Year 2573 celebration, transforming the occasion into a vibrant cultural experience. The event embraced the richness of Chinese traditions with elegant décor, festive ambience, and captivating entertainment",
    gallery: [
      "/images/work/mandiri/1.jpg",
      "/images/work/mandiri/2.jpg",
      "/images/work/mandiri/3.jpg",
      "/images/work/mandiri/4.jpg",
      "/images/work/mandiri/5.jpg",
      "/images/work/mandiri/6.jpg",
    ],
  },
  {
    slug: "alibaba",
    name: "Developer Summit 2025",
    logo: "/images/Client/alibaba.png",
    year: "2024",
    img: "/images/work/alibaba/banner.jpg",
    description: "The AI Forward - Alibaba Cloud developer summit 2025 was held on January 21 at Raffles Hotel Jakarta, bringing together 1.200 tech leaders, experts, and developers. The event featured keynotes, product launches, and panels on AI Innovation, along with showcases and networking opportunities centered around Alibaba Cloud Solutions.",
    gallery: [
      "/images/work/alibaba/1.jpg",
      "/images/work/alibaba/2.jpg",
      "/images/work/alibaba/3.jpg",
      "/images/work/alibaba/4.jpg",
      "/images/work/alibaba/5.jpg",
    ],
  },
];

async function main() {
  console.log("Starting database migration...");
  
  try {
    // Clear existing works
    await (prisma as any).works.deleteMany();
    console.log("Cleared existing works");
    
    // Insert new works
    for (const work of works) {
      await (prisma as any).works.create({
        data: {
          slug: work.slug,
          name: work.name, // Use name field
          description: work.description,
          logo: work.logo,
          year: work.year,
          img: work.img,
        },
      });
      console.log(`Created work: ${work.name}`);
    }
    
    console.log("Database migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

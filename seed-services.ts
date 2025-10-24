import { getDb } from "./server/db";
import { services } from "./drizzle/schema";

async function seedServices() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  const sampleServices = [
    {
      name: "Logo Design",
      description: "Professional custom logo design that represents your brand identity",
      price: 25000, // $250
      category: "logo",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
      features: JSON.stringify(["Custom design", "3 revisions", "Source files", "High resolution"]),
      isActive: true,
    },
    {
      name: "Branding Package",
      description: "Complete branding solution including logo, color palette, and brand guidelines",
      price: 75000, // $750
      category: "branding",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
      features: JSON.stringify(["Logo design", "Brand guidelines", "Color palette", "Typography", "5 revisions"]),
      isActive: true,
    },
    {
      name: "Social Media Graphics",
      description: "Eye-catching social media templates for Instagram, Facebook, and Twitter",
      price: 15000, // $150
      category: "social-media",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=300&fit=crop",
      features: JSON.stringify(["20 templates", "Customizable", "All platforms", "High resolution"]),
      isActive: true,
    },
    {
      name: "Business Card Design",
      description: "Professional business card design with print-ready files",
      price: 8000, // $80
      category: "print",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&h=300&fit=crop",
      features: JSON.stringify(["Front & back design", "Print-ready files", "2 revisions", "Multiple formats"]),
      isActive: true,
    },
    {
      name: "Website Design",
      description: "Modern, responsive website design tailored to your business needs",
      price: 150000, // $1500
      category: "web",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
      features: JSON.stringify(["Responsive design", "5 pages", "SEO optimized", "Mobile friendly", "10 revisions"]),
      isActive: true,
    },
    {
      name: "Packaging Design",
      description: "Creative packaging design that makes your product stand out on shelves",
      price: 50000, // $500
      category: "packaging",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=300&fit=crop",
      features: JSON.stringify(["3D mockup", "Print-ready files", "4 revisions", "Multiple formats"]),
      isActive: true,
    },
  ];

  try {
    await db.insert(services).values(sampleServices);
    console.log("✓ Sample services seeded successfully!");
  } catch (error) {
    console.error("Error seeding services:", error);
    process.exit(1);
  }
}

seedServices();

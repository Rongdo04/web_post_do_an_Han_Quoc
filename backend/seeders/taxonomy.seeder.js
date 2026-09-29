// seeders/taxonomy.seeder.js
import mongoose from "mongoose";
import Taxonomy from "../models/Taxonomy.js";
import config from "../config/index.js";

// Sample categories data
const categories = [
  {
    name: "Món chính",
    type: "category",
    slug: "mon-chinh",
    description: "Các món ăn chính đặc trưng trong bữa cơm Hàn Quốc",
    usageCount: 18,
    isActive: true,
  },
  {
    name: "Món canh",
    type: "category",
    slug: "mon-canh",
    description: "Các món canh, súp và lẩu kiểu Hàn Quốc",
    usageCount: 14,
    isActive: true,
  },
  {
    name: "Món ăn vặt",
    type: "category",
    slug: "mon-an-vat",
    description: "Các món ăn đường phố và món ăn nhẹ nổi tiếng của Hàn Quốc",
    usageCount: 16,
    isActive: true,
  },
  {
    name: "Món tráng miệng",
    type: "category",
    slug: "mon-trang-mieng",
    description: "Các món bánh và món ngọt lấy cảm hứng từ ẩm thực Hàn Quốc",
    usageCount: 9,
    isActive: true,
  },
  {
    name: "Đồ uống",
    type: "category",
    slug: "do-uong",
    description: "Các loại trà, nước gạo và đồ uống truyền thống Hàn Quốc",
    usageCount: 11,
    isActive: true,
  },
  {
    name: "Kimchi & Banchan",
    type: "category",
    slug: "kimchi-banchan",
    description: "Các món ăn kèm đặc trưng như kimchi và banchan",
    usageCount: 13,
    isActive: true,
  },
];

// Sample tags data
const tags = [
  {
    name: "truyền thống",
    type: "tag",
    slug: "truyen-thong",
    description: "Công thức giữ hương vị truyền thống Hàn Quốc",
    usageCount: 20,
    isActive: true,
  },
  {
    name: "cay",
    type: "tag",
    slug: "cay",
    description: "Món ăn có vị cay đậm phong cách Hàn Quốc",
    usageCount: 18,
    isActive: true,
  },
  {
    name: "nấu nhanh",
    type: "tag",
    slug: "nau-nhanh",
    description: "Công thức phù hợp cho bữa ăn chế biến nhanh",
    usageCount: 17,
    isActive: true,
  },
  {
    name: "healthy",
    type: "tag",
    slug: "healthy",
    description: "Món ăn cân bằng dinh dưỡng và dễ ăn hằng ngày",
    usageCount: 12,
    isActive: true,
  },
  {
    name: "BBQ",
    type: "tag",
    slug: "bbq",
    description: "Các món nướng kiểu Hàn Quốc",
    usageCount: 10,
    isActive: true,
  },
  {
    name: "món cơm",
    type: "tag",
    slug: "mon-com",
    description: "Các công thức dùng cùng cơm hoặc làm từ cơm",
    usageCount: 15,
    isActive: true,
  },
];

async function seedTaxonomy() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing taxonomy data
    console.log("Clearing existing taxonomy data...");
    await Taxonomy.deleteMany({});

    // Insert categories
    console.log("Seeding categories...");
    const insertedCategories = await Taxonomy.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Insert tags
    console.log("Seeding tags...");
    const insertedTags = await Taxonomy.insertMany(tags);
    console.log(`✅ Inserted ${insertedTags.length} tags`);

    console.log("🎉 Taxonomy seeding completed successfully!");

    // Display summary
    console.log("\n📊 Summary:");
    console.log(`Categories: ${insertedCategories.length}`);
    console.log(`Tags: ${insertedTags.length}`);
    console.log(`Total: ${insertedCategories.length + insertedTags.length}`);

    // List inserted items
    console.log("\n📝 Categories:");
    insertedCategories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} (${cat.slug})`);
    });

    console.log("\n🏷️ Tags:");
    insertedTags.forEach((tag, index) => {
      console.log(`  ${index + 1}. ${tag.name} (${tag.slug})`);
    });
  } catch (error) {
    console.error("❌ Error seeding taxonomy:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the seeder if this file is executed directly
const entryFile = process.argv[1] ? process.argv[1].replace(/\\/g, "/") : "";
const isMainModule = entryFile && import.meta.url.endsWith(entryFile);

if (isMainModule) {
  seedTaxonomy();
}

export default seedTaxonomy;

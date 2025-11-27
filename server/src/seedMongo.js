require("dotenv").config();
const mongoose = require("mongoose");
const County = require("./models/county.model");
const fs = require("fs");
const path = require("path");

// CONNECT
const mongoUri = process.env.MONGO_URL;

if (!mongoUri) {
  console.error("❌ MONGO_URL not set in .env");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// READ counties.json
const filePath = path.join(__dirname, "counties.json");
const counties = JSON.parse(fs.readFileSync(filePath, "utf-8"));

(async () => {
  try {
    await County.deleteMany({});
    console.log("🗑 Existing counties removed");

    await County.insertMany(counties);
    console.log(`✅ Inserted ${counties.length} counties`);

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    mongoose.connection.close();
  }
})();

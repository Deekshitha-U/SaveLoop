
import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is missing from server/.env");
  process.exit(1);
}

try {
  console.log("🔄 Testing MongoDB Atlas connection...");

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log("✅ MongoDB connected successfully!");
  console.log("Database:", mongoose.connection.name);

} catch (error) {
  console.error("\n❌ MongoDB connection failed");
  console.error("Error type:", error.name);
  console.error("Message:", error.message);

  if (error.reason?.servers) {
    console.log("\n--- Individual server errors ---");

    for (const [address, server] of error.reason.servers) {
      console.log("\nServer:", address);
      console.log("Status:", server.type);
      console.log("Error:", server.error?.name || "None");
      console.log("Details:", server.error?.message || "None");
    }
  }

} finally {
  await mongoose.disconnect();
}

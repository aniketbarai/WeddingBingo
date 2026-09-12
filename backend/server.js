import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";

const PORT = Number(process.env.PORT || 5000);

// Fail fast on missing required config instead of booting into a broken
// state (e.g. every admin session silently unverifiable without JWT_SECRET).
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD", "FRONTEND_URL"];
const RECOMMENDED_ENV = ["IMAGEKIT_PUBLIC_KEY", "IMAGEKIT_PRIVATE_KEY", "IMAGEKIT_URL_ENDPOINT", "EMAIL_USER", "EMAIL_PASS"];

const missingRequired = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingRequired.length) {
  console.error(`Missing required environment variables: ${missingRequired.join(", ")}. Copy .env.example to .env and fill them in.`);
  process.exit(1);
}
if (process.env.NODE_ENV === "production" && (process.env.JWT_SECRET?.length || 0) < 32) {
  console.error("JWT_SECRET is too short for production. Use at least 32 random characters.");
  process.exit(1);
}
const missingRecommended = RECOMMENDED_ENV.filter((key) => !process.env[key]);
if (missingRecommended.length) {
  console.warn(`Missing optional environment variables (some features will be disabled): ${missingRecommended.join(", ")}`);
}

const start = async () => {
  try {
    await connectDB();
    await seedAdmin();
    const server = app.listen(PORT, () => console.log(`WeddingBingo backend running on port ${PORT}`));

    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down gracefully…`);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error(`Backend startup failed: ${error.message}`);
    process.exit(1);
  }
};

start();

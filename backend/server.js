import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";

const PORT = Number(process.env.PORT || 5000);

const start = async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => console.log(`WeddingBingo backend running on port ${PORT}`));
  } catch (error) {
    console.error(`Backend startup failed: ${error.message}`);
    process.exit(1);
  }
};

start();

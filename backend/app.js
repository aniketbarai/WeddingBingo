import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import mailRoutes from "./routes/mailRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { asyncHandler } from "./utils/asyncHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import { sanitizeInput } from "./middlewares/sanitizeInput.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(sanitizeInput);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Serve admin-uploaded photos (see middlewares/upload.js)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", mailRoutes);
app.use("/api", imageRoutes);
app.use("/api/admin", adminRoutes);

// Limit requests (anti-spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // max 50 requests per IP
  message: "Too many requests, try later",
});

app.use("/api/send-mail", limiter);

// Central error handler
app.use(errorHandler);

export default app;


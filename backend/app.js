import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import mailRoutes from "./routes/mailRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mvpRoutes from "./routes/mvpRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import { sanitizeInput } from "./middlewares/sanitizeInput.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((value) => value.trim());
app.use(cors({ origin: (origin, callback) => (!origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error("Origin not allowed"))), credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(sanitizeInput);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false });
app.use("/api", publicLimiter);
app.use("/api", mailRoutes);
app.use("/api", imageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", dashboardRoutes);
app.use("/api/admin", mvpRoutes);
app.use(errorHandler);

export default app;

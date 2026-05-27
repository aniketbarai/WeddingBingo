import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import mailRoutes from "./routes/mailRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", mailRoutes);
app.use("/api", imageRoutes);

app.use(helmet());

// Limit requests (anti-spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // max 50 requests per IP
  message: "Too many requests, try later",
});

app.use("/api/send-mail", limiter);

export default app;
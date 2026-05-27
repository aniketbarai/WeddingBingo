import express from "express";
import { getImages } from "../controllers/imageController.js";

const router = express.Router();

router.get("/images", getImages);

export default router;
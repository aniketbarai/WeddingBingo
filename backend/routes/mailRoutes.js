import express from "express";
import { sendMail } from "../controllers/mailController.js";
import { createBookingRequest } from "../controllers/mvpController.js";

const router = express.Router();

router.post("/send-mail", sendMail);
router.post("/booking-requests", createBookingRequest);

export default router;
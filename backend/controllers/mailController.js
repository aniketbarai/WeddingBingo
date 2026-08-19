import validator from "validator";
import Inquiry from "../models/Inquiry.js";
import { sendMailService } from "../services/mailService.js";

export const sendMail = async (req, res) => {
  const { name, email, date, message } = req.body;
  if (!name?.trim() || !validator.isEmail(String(email || "")) || !message?.trim()) {
    return res.status(400).json({ success: false, message: "Name, valid email, and message are required" });
  }

  const inquiry = await Inquiry.create({ name: name.trim(), email: email.toLowerCase().trim(), weddingDate: date || undefined, message: message.trim(), source: "website" });
  let notificationSent = false;
  try {
    await sendMailService({ name, email, date, message });
    notificationSent = true;
  } catch (error) {
    console.error("Mail notification failed:", error.message);
  }
  return res.status(201).json({ success: true, inquiryId: inquiry._id, notificationSent });
};

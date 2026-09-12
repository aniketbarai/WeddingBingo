import validator from "validator";
import Inquiry from "../models/Inquiry.js";
import { sendMailService } from "../services/mailService.js";

export const sendMail = async (req, res) => {
  const { name, email, phone, date, message } = req.body;
  const normalizedPhone = String(phone || "").trim();
  const phoneDigits = normalizedPhone.replace(/\D/g, "");
  const validPhone = phoneDigits.length >= 10 && phoneDigits.length <= 15 && !/^([0-9])\1+$/.test(phoneDigits);
  if (!name?.trim() || !validator.isEmail(String(email || "")) || !validPhone || !message?.trim()) {
    return res.status(400).json({ success: false, message: "Name, valid email, valid phone number, and message are required" });
  }

  const inquiry = await Inquiry.create({ name: name.trim(), email: email.toLowerCase().trim(), phone: normalizedPhone, weddingDate: date || undefined, message: message.trim(), source: "website" });
  let notificationSent = false;
  try {
    await sendMailService({ name, email, phone: normalizedPhone, date, message });
    notificationSent = true;
  } catch (error) {
    console.error("Mail notification failed:", error.message);
  }
  return res.status(201).json({ success: true, inquiryId: inquiry._id, notificationSent });
};

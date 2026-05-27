import { sendMailService } from "../services/mailService.js";
import validator from "validator";

export const sendMail = async (req, res) => {
  const { name, email, date, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    await sendMailService({ name, email, date, message });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mail Error:", err);
    res.status(500).json({ success: false });
  }
};
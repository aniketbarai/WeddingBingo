import nodemailer from "nodemailer";
import { clientHTML, adminHTML } from "../utils/emailTemplates.js";

export const sendMailService = async ({ name, email, date, message }) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 1️⃣ Send to ADMIN
  await transporter.sendMail({
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to: process.env.EMAIL_USER,
    subject: `✨ New Inquiry: ${name}`,
    html: adminHTML(name, email, date, message),
  });

  // 2️⃣ Send to CLIENT (Confirmation)
  await transporter.sendMail({
    from: `"Wedding Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "We received your request ✨",
    html: clientHTML(name),
  });

};
import nodemailer from "nodemailer";

// Single shared transporter, configured entirely from env vars so it works
// with any SMTP provider (Gmail, SES, Postmark, etc) — not hardcoded to Gmail.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;

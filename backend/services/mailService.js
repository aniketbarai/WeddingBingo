import transporter from "../config/mailer.js";
import { clientHTML, adminHTML } from "../utils/emailTemplates.js";

export const sendMailService = async ({ name, email, date, message }) => {
  // 1. Notify the studio
  await transporter.sendMail({
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Inquiry: ${name}`,
    html: adminHTML(name, email, date, message),
  });

  // 2. Confirm to the couple
  await transporter.sendMail({
    from: `"Wedding Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "We received your request",
    html: clientHTML(name),
  });
};

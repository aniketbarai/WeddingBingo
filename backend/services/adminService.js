import transporter from "../config/mailer.js";

const resetHTML = (resetToken) => {
  const frontendUrl = (process.env.FRONTEND_URL || "").split(",")[0]?.trim();
  const resetLink = frontendUrl ? `${frontendUrl}/admin/reset-password/${resetToken}` : null;
  return `
  <div style="font-family:Arial;background:#0a0a0a;color:#fff;padding:24px">
    <h2 style="color:#C6A75E">Reset your password</h2>
    ${resetLink ? `<p><a href="${resetLink}" style="color:#C6A75E">Click here to reset your password</a></p><p>Or use the token below:</p>` : `<p>Use the token below to reset your admin password.</p>`}
    <div style="padding:12px 16px;border:1px solid #C6A75E;display:inline-block;letter-spacing:2px;font-size:14px">${resetToken}</div>
    <p style="margin-top:18px;color:#aaa;font-size:12px">This token expires in 15 minutes.</p>
  </div>
`;
};

export const sendAdminForgotEmail = async ({ email, resetToken }) => {
  await transporter.sendMail({
    from: `"Wedding Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Admin password reset',
    html: resetHTML(resetToken),
  });
};

export const sendAdminResetEmail = async ({ email }) => {
  await transporter.sendMail({
    from: `"Wedding Studio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password successfully reset',
    html: `<div style="font-family:Arial;background:#0a0a0a;color:#fff;padding:24px"><h2 style="color:#C6A75E">Done ✅</h2><p>Your admin password has been changed successfully.</p></div>`,
  });
};


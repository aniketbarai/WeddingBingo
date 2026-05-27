export const clientHTML = (name, message) => `
  <div style="background:#0a0a0a; padding:40px 20px; font-family:'Times New Roman', serif;">
    <div style="max-width:600px; margin:auto; border:1px solid #C6A75E; padding:40px; background:#050505; text-align:center;">
      <!-- Heading -->
      <h1 style="color:#C6A75E; font-weight:100; letter-spacing:5px; text-transform:uppercase; font-size:28px;">
        ${name}
      </h1>

      <p style="color:#aaa; font-size:12px; letter-spacing:3px; margin-top:-10px;">
        Your story has been received
      </p>

      <!-- Divider -->
      <div style="margin:30px 0;">
        <span style="display:inline-block; width:40px; height:1px; background:#C6A75E;"></span>
        <span style="margin:0 10px; color:#C6A75E; font-size:10px; letter-spacing:4px;">
          WEDDING STUDIO
        </span>
        <span style="display:inline-block; width:40px; height:1px; background:#C6A75E;"></span>
      </div>

      <!-- Message -->
      <p style="color:#ddd; font-size:15px; line-height:1.8;">
        Thank you for reaching out. Your message has been carefully recorded 
        and our team will connect with you shortly to craft something unforgettable.
      </p>

      <!-- Footer -->
      <p style="margin-top:40px; color:#666; font-size:11px; letter-spacing:2px; text-transform:uppercase;">
        We don’t just capture moments, we preserve emotions.
      </p>

    </div>
  </div>
`;

export const adminHTML = (name, email, date, message) => {
  const safeMessage = message
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `
  <div style="background:#0a0a0a; padding:40px 20px; font-family: 'Segoe UI', sans-serif;">
    
    <div style="max-width:600px; margin:auto; background:#050505; border:1px solid #C6A75E; padding:30px;">
      
      <!-- Header -->
      <h2 style="color:#C6A75E; letter-spacing:3px; font-weight:500; text-transform:uppercase; font-size:18px;">
        New Inquiry Received
      </h2>

      <p style="color:#777; font-size:12px; margin-top:-10px;">
        A new client has submitted a request from your website.
      </p>

      <!-- Divider -->
      <div style="margin:20px 0; height:1px; background:#222;"></div>

      <!-- Client Details -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        
        <p style="color:#ccc; font-size:14px;">
          <strong style="color:#C6A75E;">Name:</strong> ${name}
        </p>

        <p style="color:#ccc; font-size:14px;">
          <strong style="color:#C6A75E;">Email:</strong> ${email}
        </p>

        <p style="color:#ccc; font-size:14px;">
          <strong style="color:#C6A75E;">Event Date:</strong> ${date || "Not provided"}
        </p>

      </div>

      <!-- Message Box -->
      <div style="margin-top:25px; padding:20px; background:#0f0f0f; border:1px solid #222;">
        <p style="color:#C6A75E; font-size:11px; letter-spacing:3px; margin-bottom:10px;">
          CLIENT MESSAGE
        </p>
        <p style="color:#bbb; font-size:14px; line-height:1.6;">
          ${safeMessage}
        </p>
      </div>

      <!-- Action Section -->
      <div style="margin-top:30px; text-align:center;">
        <a href="mailto:${email}" 
           style="display:inline-block; padding:12px 25px; background:#C6A75E; color:#000; text-decoration:none; font-size:12px; letter-spacing:2px; font-weight:bold;">
          REPLY TO CLIENT
        </a>
      </div>

      <!-- Footer -->
      <p style="margin-top:30px; color:#555; font-size:11px; text-align:center;">
        Wedding Studio • New Lead Notification System
      </p>

    </div>
  </div>
  `;
};
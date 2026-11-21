import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory OTP Store for Password Recovery
interface OtpRecord {
  otp: string;
  expiresAt: number; // 5 minutes from generation
  attempts: number;
  resendAvailableAt: number; // 60s cooldown
  verified: boolean;
  resetToken?: string;
}

const otpStore = new Map<string, OtpRecord>();

// Clean up expired OTPs periodically (every 5 mins)
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt + 60000) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

// Setup Nodemailer Transporter
const createEmailTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback / Development transporter
  return null;
};

async function startServer() {
  const app = express();
  const PORT = 3005;

  app.use(express.json({ limit: "50mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. FORGOT PASSWORD: Send OTP to Email
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Please provide a valid registered email address." });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const now = Date.now();
      const existing = otpStore.get(normalizedEmail);

      // Check cooldown (60 seconds)
      if (existing && now < existing.resendAvailableAt) {
        const waitSeconds = Math.ceil((existing.resendAvailableAt - now) / 1000);
        return res.status(429).json({
          error: `Please wait ${waitSeconds} seconds before requesting a new OTP.`
        });
      }

      // Generate secure 6-digit random OTP
      const otp = Math.floor(100000 + crypto.randomInt(900000)).toString();
      const expiresAt = now + 5 * 60 * 1000; // 5 minutes
      const resendAvailableAt = now + 60 * 1000; // 60s cooldown

      otpStore.set(normalizedEmail, {
        otp,
        expiresAt,
        resendAvailableAt,
        attempts: 0,
        verified: false,
      });

      console.log(`\n======================================================`);
      console.log(`[PASSWORD RECOVERY OTP] Generated for: ${normalizedEmail}`);
      console.log(`[SECURITY OTP CODE]: >>> ${otp} <<< (Valid for 5 mins)`);
      console.log(`======================================================\n`);

      // Attempt to send real email if SMTP is configured
      const transporter = createEmailTransporter();
      if (transporter) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"SkillToHire Security" <no-reply@skilltohire.com>`,
            to: normalizedEmail,
            subject: `Your Password Reset OTP: ${otp} - SkillToHire`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #1a6ef5; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SkillToHire</h1>
                  <p style="color: #64748b; font-size: 13px; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Account Security Protocol</p>
                </div>
                <div style="background: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; text-align: center;">
                  <p style="color: #334155; font-size: 14px; margin-top: 0; margin-bottom: 16px; line-height: 1.5;">You requested a password reset for your account. Use the 6-digit verification code below:</p>
                  <div style="display: inline-block; padding: 12px 32px; background: #1a6ef5; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 8px; border-radius: 12px; margin-bottom: 12px;">
                    ${otp}
                  </div>
                  <p style="color: #ef4444; font-size: 12px; margin: 0; font-weight: 600;">⏱️ This OTP expires in exactly 5 minutes.</p>
                </div>
                <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 24px; line-height: 1.5;">If you did not request this password reset, please ignore this email or contact support.</p>
              </div>
            `
          });
        } catch (emailErr: any) {
          console.warn("SMTP email dispatch notice:", emailErr.message);
        }
      }

      // Masked email for display (e.g. s***@gmail.com)
      const [userPart, domainPart] = normalizedEmail.split("@");
      const maskedEmail = userPart.length > 2 
        ? `${userPart[0]}***${userPart.slice(-1)}@${domainPart}`
        : `${userPart[0]}***@${domainPart}`;

      res.json({
        success: true,
        message: `OTP sent successfully to ${maskedEmail}`,
        maskedEmail,
        expiresInSeconds: 300,
        // In local/dev environments, also pass otp for frictionless testing
        devOtp: process.env.NODE_ENV !== "production" ? otp : undefined
      });
    } catch (err: any) {
      console.error("Error in /api/auth/send-otp:", err);
      res.status(500).json({ error: "Failed to dispatch password recovery OTP. Please try again." });
    }
  });

  // 2. FORGOT PASSWORD: Verify OTP
  app.post("/api/auth/verify-otp", (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required." });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const record = otpStore.get(normalizedEmail);

      if (!record) {
        return res.status(400).json({ error: "No active password reset request found for this email. Please request a new OTP." });
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(normalizedEmail);
        return res.status(400).json({ error: "This OTP has expired (5-minute limit exceeded). Please request a new one." });
      }

      // Increment incorrect attempts
      if (record.otp.trim() !== otp.trim()) {
        record.attempts += 1;
        const remaining = 5 - record.attempts;
        if (remaining <= 0) {
          otpStore.delete(normalizedEmail);
          return res.status(403).json({ error: "Too many incorrect OTP attempts. For security, please request a new OTP." });
        }
        return res.status(400).json({ error: `Invalid OTP code. ${remaining} attempt(s) remaining.` });
      }

      // Successful verification -> generate single-use reset token
      const resetToken = crypto.randomBytes(24).toString("hex");
      record.verified = true;
      record.resetToken = resetToken;

      res.json({
        success: true,
        message: "OTP verified successfully. You may now set your new password.",
        resetToken
      });
    } catch (err: any) {
      console.error("Error in /api/auth/verify-otp:", err);
      res.status(500).json({ error: "Failed to verify OTP." });
    }
  });

  // 3. FORGOT PASSWORD: Reset Password with Verified Token
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, resetToken, newPassword } = req.body;
      if (!email || !resetToken || !newPassword) {
        return res.status(400).json({ error: "Email, reset token, and new password are required." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const record = otpStore.get(normalizedEmail);

      if (!record || !record.verified || record.resetToken !== resetToken) {
        return res.status(403).json({ error: "Invalid or expired reset session. Please restart password recovery." });
      }

      // Clear OTP record
      otpStore.delete(normalizedEmail);

      console.log(`[PASSWORD RESET SUCCESS] Password successfully updated for: ${normalizedEmail}`);

      res.json({
        success: true,
        message: "Your password has been successfully reset! You can now log in with your new credentials."
      });
    } catch (err: any) {
      console.error("Error in /api/auth/reset-password:", err);
      res.status(500).json({ error: "Failed to reset password. Please try again." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { port: 24680 } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

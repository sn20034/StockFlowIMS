import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import crypto from "crypto";

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

export const generateVerificationToken = () =>
  crypto.randomBytes(32).toString("hex");

export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const sendSmtpEmail = {
    sender: { name: "StockFlow IMS", email: process.env.BREVO_SENDER_EMAIL },
    to: [{ email, name }],
    subject: "Verify your StockFlow IMS account",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Welcome to StockFlow IMS, ${name}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${verifyUrl}" style="display:inline-block; padding:12px 24px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px; margin:16px 0;">
          Verify Email
        </a>
        <p>Or copy this link into your browser:</p>
        <p style="word-break: break-all; color:#555;">${verifyUrl}</p>
        <p style="color:#888; font-size:13px;">This link expires in 24 hours.</p>
      </div>
    `,
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

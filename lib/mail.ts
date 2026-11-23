import nodemailer from "nodemailer";
import { Resend } from "resend";
import { SITE_NAME_BN } from "@/lib/site";

// Gmail SMTP configuration
const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

const transporter =
  smtpUser && smtpPass
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
): Promise<{ ok: boolean; error?: string }> {
  const fromName = SITE_NAME_BN;
  const fromAddress = smtpUser || process.env.EMAIL_FROM || "onboarding@resend.dev";
  const subject = `পাসওয়ার্ড রিসেট লিংক — ${SITE_NAME_BN}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #059669; margin-top: 0; font-size: 22px;">${SITE_NAME_BN}</h2>
      <p style="font-size: 15px; color: #1c1917; line-height: 1.6;">
        আপনার অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার একটি অনুরোধ পাওয়া গেছে। নতুন পাসওয়ার্ড সেট করতে নিচের বাটনে ক্লিক করুন:
      </p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="${resetLink}" style="background: #059669; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          পাসওয়ার্ড রিসেট করুন
        </a>
      </div>
      <p style="font-size: 13px; color: #78716c; line-height: 1.5;">
        এই লিংকটির মেয়াদ ১ ঘণ্টা থাকবে। আপনি যদি এই অনুরোধ না করে থাকেন, তবে নির্দ্বিধায় এই ইমেইলটি উপেক্ষা করুন। আপনার অ্যাকাউন্ট নিরাপদ রয়েছে।
      </p>
      <hr style="border: none; border-top: 1px solid #f5f5f4; margin: 24px 0;" />
      <p style="font-size: 12px; color: #a8a29e;">
        বাটনে ক্লিক করতে সমস্যা হলে নিচের লিংকটি কপি করে ব্রাউজারে পেস্ট করুন: <br />
        <a href="${resetLink}" style="color: #059669; word-break: break-all;">${resetLink}</a>
      </p>
    </div>
  `;

  // 1. Send via Gmail SMTP if configured
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to: email,
        subject,
        html,
      });
      return { ok: true };
    } catch (err: unknown) {
      console.error("Gmail SMTP error:", err);
      return {
        ok: false,
        error: "জিমেইল সার্ভার থেকে ইমেইল পাঠানো সম্ভব হয়নি।",
      };
    }
  }

  // 2. Send via Resend if configured
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: `TutorCarePoint <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
        to: email,
        subject,
        html,
      });
      if (error) {
        console.error("Resend error:", error);
        return { ok: false, error: error.message };
      }
      return { ok: true };
    } catch (err: unknown) {
      console.error("Resend error:", err);
      return { ok: false, error: "ইমেইল পাঠানো সম্ভব হয়নি।" };
    }
  }

  // 3. Fallback for Local Dev Simulation
  console.log("\n========================================================");
  console.log(`[LOCAL DEV PASSWORD RESET LINK]`);
  console.log(`To: ${email}`);
  console.log(`Reset Link: ${resetLink}`);
  console.log("========================================================\n");
  return { ok: true };
}

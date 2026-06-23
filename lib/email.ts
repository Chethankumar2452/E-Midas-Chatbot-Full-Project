import nodemailer from "nodemailer";
import dbConnect from "./db";
import EmailLog from "@/models/EmailLog";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: options.from || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const result = await transporter.sendMail(mailOptions);

    // Log email
    await dbConnect();
    await EmailLog.create({
      to: options.to,
      subject: options.subject,
      status: "sent",
    });

    console.log("Email sent:", result.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);

    // Log failed email
    try {
      await dbConnect();
      await EmailLog.create({
        to: options.to,
        subject: options.subject,
        status: "failed",
        error: (error as Error).message,
      });
    } catch (dbError) {
      console.error("Error logging email:", dbError);
    }

    return false;
  }
}

export function generateEmailHtml(
  templateBody: string,
  variables: Record<string, string>
): string {
  let html = templateBody;
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    html = html.replace(new RegExp(placeholder, "g"), value);
  });
  return html;
}

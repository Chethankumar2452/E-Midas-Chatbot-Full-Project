import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EmailTemplate from "@/models/EmailTemplate";
import { sendEmail, generateEmailHtml } from "@/lib/email";
import { verifyToken } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return false;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return false;
  }

  return verifyToken(token) !== null;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      templateId,
      recipientEmail,
      variables = {},
    } = body;

    if (!templateId || !recipientEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const template = await EmailTemplate.findById(templateId);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const emailHtml = generateEmailHtml(
      template.body,
      variables
    );

    let subject = template.subject;

    Object.entries(variables).forEach(([key, value]) => {
      subject = subject.replace(
        new RegExp(`{{${key}}}`, "g"),
        String(value)
      );
    });

    const success = await sendEmail({
      to: recipientEmail,
      subject,
      html: emailHtml,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email send error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
      },
      { status: 500 }
    );
  }
}
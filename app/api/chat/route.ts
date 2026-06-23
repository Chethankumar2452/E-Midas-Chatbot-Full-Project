import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

const SYSTEM_PROMPT = `
You are a professional and friendly Hospital AI Assistant.

Responsibilities:
- Answer questions about hospital services
- Help patients find doctors
- Assist with appointment booking
- Explain departments and specializations
- Collect patient information when appropriate

Guidelines:
- Be professional and empathetic
- Keep responses concise and helpful
- Ask follow-up questions when needed
- Suggest relevant doctors or departments
- Help patients schedule appointments

When booking appointments collect:
- Name
- Phone Number
- Email
- Doctor or Specialization
- Preferred Date
- Preferred Time
- Additional Notes
`;

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const conversationHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(`
${SYSTEM_PROMPT}

Patient Message:
${message}
`);

    const responseText = result.response.text();

    let leadData = null;

    const emailMatch =
      message.match(/[\w.-]+@[\w.-]+\.\w+/);

    const phoneMatch =
      message.match(
        /\b\d{10}\b|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/
      );

    const words = message.split(" ");

    const capitalizedWords = words.filter(
      (word : string) =>
        word.length > 2 &&
        word[0] &&
        word[0] === word[0].toUpperCase()
    );

    const shouldCreateLead =
      message.toLowerCase().includes("appointment") ||
      message.toLowerCase().includes("doctor") ||
      message.toLowerCase().includes("consultation");

    if (
      shouldCreateLead &&
      (emailMatch ||
        phoneMatch ||
        capitalizedWords.length > 0)
    ) {
      try {
        await dbConnect();

        leadData = {
          name: capitalizedWords[0] || "Unknown",
          email: emailMatch?.[0] || "",
          phone: phoneMatch?.[0] || "",
          message,
          source: "chatbot",
        };

        const existingLead = await Lead.findOne({
          $or: [
            { email: leadData.email },
            { phone: leadData.phone },
          ],
        });

        if (
          !existingLead &&
          (leadData.email || leadData.phone)
        ) {
          await Lead.create(leadData);
        }
      } catch (leadError) {
        console.error(
          "Lead creation error:",
          leadError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: responseText,
      lead: leadData,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process chat message",
      },
      { status: 500 }
    );
  }
}
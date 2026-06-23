import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Hospital AI CRM - Patient Management & Appointment Booking",
  description:
    "Complete hospital AI CRM system with patient management, appointment booking, and AI chatbot assistant",
  keywords: [
    "hospital",
    "CRM",
    "patient",
    "appointment",
    "medical",
    "AI",
    "chatbot",
  ],
  authors: [{ name: "Hospital AI CRM" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F6FDD" />
      </head>
      <body className="gradient-medical min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

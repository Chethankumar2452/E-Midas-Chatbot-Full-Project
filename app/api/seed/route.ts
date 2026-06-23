import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    await User.deleteOne({
      email: "admin@example.com",
    });

    const user = await User.create({
      name: "Administrator",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin reset successfully",
      email: user.email,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Reset failed" },
      { status: 500 }
    );
  }
}
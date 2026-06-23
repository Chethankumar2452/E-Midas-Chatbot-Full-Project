import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Appointment from "@/models/Appointment";
import { verifyToken } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.split(" ")[1];
  return verifyToken(token) !== null;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query: any = {};
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const appointments = await Appointment.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientName, phone, email, doctor, clinic, date, time, notes } = body;

    if (!patientName || !phone || !email || !doctor || !clinic || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const appointment = await Appointment.create({
      patientName, phone, email, doctor, clinic, date, time, notes, status: "pending",
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    await dbConnect();

    const appointment = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    await dbConnect();

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}

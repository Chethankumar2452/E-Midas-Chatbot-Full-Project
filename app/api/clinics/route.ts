import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Clinic from "@/models/Clinic";
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query: any = {};
    if (search) {
      query.$or = [
        { clinicName: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const clinics = await Clinic.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Clinic.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: clinics,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return NextResponse.json({ error: "Failed to fetch clinics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clinicName, address, city, phone, email, website } = body;

    if (!clinicName || !address || !city || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const clinic = await Clinic.create({
      clinicName, address, city, phone, email, website,
    });

    return NextResponse.json({ success: true, data: clinic }, { status: 201 });
  } catch (error) {
    console.error("Error creating clinic:", error);
    return NextResponse.json({ error: "Failed to create clinic" }, { status: 500 });
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
      return NextResponse.json({ error: "Clinic ID is required" }, { status: 400 });
    }

    await dbConnect();

    const clinic = await Clinic.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: clinic });
  } catch (error) {
    console.error("Error updating clinic:", error);
    return NextResponse.json({ error: "Failed to update clinic" }, { status: 500 });
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
      return NextResponse.json({ error: "Clinic ID is required" }, { status: 400 });
    }

    await dbConnect();

    const clinic = await Clinic.findByIdAndDelete(id);

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Clinic deleted successfully" });
  } catch (error) {
    console.error("Error deleting clinic:", error);
    return NextResponse.json({ error: "Failed to delete clinic" }, { status: 500 });
  }
}

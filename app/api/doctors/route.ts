import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Doctor from "@/models/Doctor";
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
    const clinic = searchParams.get("clinic");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query: any = {};
    if (search) {
      query.$or = [
        { doctorName: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }
    if (clinic) {
      query.clinic = clinic;
    }

    const skip = (page - 1) * limit;
    const doctors = await Doctor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Doctor.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      doctorName,
      specialization,
      qualification,
      experience,
      clinic,
      availableDays,
      availableTime,
      status,
    } = body;

    if (!doctorName || !specialization || !clinic) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const doctor = await Doctor.create({
      doctorName,
      specialization,
      qualification,
      experience,
      clinic,
      availableDays,
      availableTime,
      status: status || "active",
    });

    return NextResponse.json(
      { success: true, data: doctor },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { error: "Failed to update doctor" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}

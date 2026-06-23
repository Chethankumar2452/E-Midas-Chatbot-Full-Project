import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import Patient from "@/models/Patient";
import Doctor from "@/models/Doctor";
import Clinic from "@/models/Clinic";
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

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all stats
    const [
      totalLeads,
      totalPatients,
      totalDoctors,
      totalClinics,
      appointmentsToday,
      monthlyLeads,
      monthlyAppointments,
      doctorBookings,
    ] = await Promise.all([
      Lead.countDocuments(),
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Clinic.countDocuments(),
      Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow },
      }),
      Lead.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      }),
      Appointment.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      }),
      Appointment.aggregate([
        {
          $group: {
            _id: "$doctor",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        totalPatients,
        totalDoctors,
        totalClinics,
        appointmentsToday,
        monthlyLeads,
        monthlyAppointments,
        topDoctors: doctorBookings,
        revenue: appointmentsToday * 500, // Placeholder
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

import mongoose, { Schema, Document } from "mongoose";

interface IAppointment extends Document {
  patientName: string;
  patientId?: mongoose.Types.ObjectId;
  phone: string;
  email: string;
  doctor: string;
  doctorId?: mongoose.Types.ObjectId;
  clinic: string;
  clinicId?: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    clinic: {
      type: String,
      required: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: String,
  },
  { timestamps: true }
);

// Index for faster queries
appointmentSchema.index({ date: -1 });
appointmentSchema.index({ doctor: 1 });
appointmentSchema.index({ email: 1 });
appointmentSchema.index({ status: 1 });

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;

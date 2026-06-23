import mongoose, { Schema, Document } from "mongoose";

interface IPatient extends Document {
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
  address: string;
  notes?: string;
  medicalHistory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    medicalHistory: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ name: "text" });

const Patient =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", patientSchema);

export default Patient;

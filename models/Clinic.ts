import mongoose, { Schema, Document } from "mongoose";

interface IClinic extends Document {
  clinicName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clinicSchema = new Schema<IClinic>(
  {
    clinicName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
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
    website: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
clinicSchema.index({ city: 1 });
clinicSchema.index({ clinicName: "text" });

const Clinic =
  mongoose.models.Clinic || mongoose.model<IClinic>("Clinic", clinicSchema);

export default Clinic;

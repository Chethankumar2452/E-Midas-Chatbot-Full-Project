import mongoose, { Schema, Document } from "mongoose";

interface IDoctor extends Document {
  doctorName: string;
  specialization: string;
  qualification: string;
  experience: number;
  clinic: string;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  status: "active" | "inactive";
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    clinic: {
      type: String,
      required: true,
    },
    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    availableTime: {
      start: String,
      end: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    image: String,
  },
  { timestamps: true }
);

// Index for faster queries
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ clinic: 1 });
doctorSchema.index({ doctorName: "text" });

const Doctor =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", doctorSchema);

export default Doctor;

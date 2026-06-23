import mongoose, { Schema, Document } from "mongoose";

interface ILead extends Document {
  name: string;
  phone: string;
  email: string;
  message?: string;
  source?: string;
  status: "new" | "contacted" | "converted";
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
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
    message: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      default: "chatbot",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
  },
  { timestamps: true }
);

// Index for faster queries
leadSchema.index({ email: 1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.models.Lead || mongoose.model<ILead>("Lead", leadSchema);

export default Lead;

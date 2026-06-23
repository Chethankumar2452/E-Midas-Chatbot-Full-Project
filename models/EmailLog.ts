import mongoose, { Schema, Document } from "mongoose";

interface IEmailLog extends Document {
  to: string;
  subject: string;
  status: "sent" | "failed";
  error?: string;
  createdAt: Date;
}

const emailLogSchema = new Schema<IEmailLog>(
  {
    to: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
    error: String,
  },
  { timestamps: true }
);

// Index for faster queries
emailLogSchema.index({ to: 1 });
emailLogSchema.index({ status: 1 });
emailLogSchema.index({ createdAt: -1 });

const EmailLog =
  mongoose.models.EmailLog ||
  mongoose.model<IEmailLog>("EmailLog", emailLogSchema);

export default EmailLog;

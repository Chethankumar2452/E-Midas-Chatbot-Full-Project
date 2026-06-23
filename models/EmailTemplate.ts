import mongoose, { Schema, Document } from "mongoose";

interface IEmailTemplate extends Document {
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

const emailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    variables: [String],
  },
  { timestamps: true }
);

const EmailTemplate =
  mongoose.models.EmailTemplate ||
  mongoose.model<IEmailTemplate>("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;

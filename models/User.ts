import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "admin" | "staff";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "admin",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcryptjs.compare(password, this.password);
};

// Prevent password from being returned in JSON
userSchema.methods.toJSON = function () {
  const { password, ...user } = this.toObject();
  return user;
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

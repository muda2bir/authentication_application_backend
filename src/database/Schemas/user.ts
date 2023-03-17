import mongoose, { Document } from "mongoose";
import { getRandomFourDigitNumber } from "../../utils/helpers";
import { hashPassword } from "../../utils/helpers";

export type UserDocument = Document & {
  email: string;
  password: string;
  name: string;
  bio: string;
  phone: string;
  picture: string;
  googleId: string;
  createdAt: Date;
};

const userSchema = new mongoose.Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: `user_${getRandomFourDigitNumber()}`,
  },
  bio: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  picture: {
    type: String,
    default: "",
  },
  googleId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  },
});

const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
export default User;

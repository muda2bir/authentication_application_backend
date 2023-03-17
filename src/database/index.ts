import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  const DB = process.env.DATABASE as string; // TODO: Update the DATABASE link after successful project deployment
  await mongoose.connect(DB);
};

export default connectDB;

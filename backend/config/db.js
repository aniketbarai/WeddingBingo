import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI (or legacy MONGO_URI) environment variable");
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

export default connectDB;

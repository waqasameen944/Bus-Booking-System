import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const state = mongoose.connection.readyState;
    if (state === 1) return console.log("Database already connected");
    if (state === 2) return console.log("Database connecting");
    if (state === 3) return console.log("Database disconnected");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default dbConnect;

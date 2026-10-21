import mongoose from "mongoose";
import dns from "node:dns";
import { DB_URI } from "../config/config.js";
import { connectRedis } from "./redis.connection.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dbConnection = async () => {
  try {
    await mongoose.connect(DB_URI);
    await connectRedis();
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
  }
};

export default dbConnection;

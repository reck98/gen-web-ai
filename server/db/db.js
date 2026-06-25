import mongoose from "mongoose";
import { DB_NAME, MONGO_URI } from "../utils/config.js";
import path from "path";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`DB error: ${error}`);
        process.exit(1);
    }
};

export default connectDB;

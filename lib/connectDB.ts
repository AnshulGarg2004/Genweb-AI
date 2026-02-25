import mongoose from "mongoose"

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
        if(!conn) {
            console.log("Error in connecting to mongodb");
        }

        console.log("Connected to MongoDB");
        return conn;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectDB;
import mongoose from "mongoose"

declare global {
    var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseConn ?? { conn: null, promise: null };
global.mongooseConn = cached;

const connectDB = async() => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }

        if (cached.conn || mongoose.connection.readyState === 1) {
            return mongoose;
        }

        if (!cached.promise) {
            cached.promise = mongoose.connect(process.env.MONGODB_URI!);
        }

        const conn = await cached.promise;
        cached.conn = conn;

        if(!conn) {
            throw new Error("Error in connecting to mongodb");
        }

        console.log("Connected to MongoDB");
        return conn;
    } catch (error) {
        cached.promise = null;
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export default connectDB;
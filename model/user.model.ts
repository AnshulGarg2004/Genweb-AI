import { User } from "@clerk/nextjs/server";
import mongoose, { Schema } from "mongoose"

export interface Iuser extends mongoose.Document {
    clerkId : string;
    plan : string;
    credits : number;
}

const userSchema : Schema<Iuser> = new mongoose.Schema<Iuser>({
    clerkId : {
        type : String,
        required : true,
        unique : true
    },
    plan : {
        type : String,
        enum : ["free", "pro", 'enterprise'],
        default : "free"
    },
    credits : {
        type : Number,
        default : 100
    }
}, {timestamps : true});

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);
export default Users;
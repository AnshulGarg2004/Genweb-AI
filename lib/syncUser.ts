import { auth } from "@clerk/nextjs/server"
import connectDB from "./connectDB";
import Users from "@/model/user.model";
import { NextResponse } from "next/server";
import { ReactJsxRuntime } from "next/dist/server/route-modules/app-page/vendored/rsc/entrypoints";

export const syncUser = async () => {

    try {
        const { userId } = await auth();
        if (!userId) return null;
    
        await connectDB();
    
        const existingUser = await Users.findOne({ userId });
        if(existingUser) {
            console.log('already a user exists');
            return NextResponse.json({success : false, message: "User already exist", existingUser}, {status : 401});
        }
    
        const newUser = await Users.create({clerkId : userId});
    
        console.log("User created successfully");
        return NextResponse.json({success : true, message : "User created successfully", newUser}, {status : 200});
    
    } catch (error) {
        console.log("Error in creating user: ", error);
        
        return NextResponse.json({success : false, message : "Cannot create user"}, {status : 500})
    }
}
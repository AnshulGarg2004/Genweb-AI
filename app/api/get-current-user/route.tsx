import Users from "@/model/user.model"
import connectDB from "@/lib/connectDB";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectDB();
        const {userId} = await auth();
        const existingUser = await Users.findOne({clerkId : userId});
        if(!existingUser) {
            console.log("User does not exist");
            return NextResponse.json({success : false, message : "User does not exists"}, {status : 401});
        }
        console.log("Uer of mongodb : ", existingUser);
        return NextResponse.json({success : true, message : "User found Successfully", existingUser}, {status : 200});
    } catch (error) {
        console.log("Error in get-current-user: ", error);
        return NextResponse.json({success : false, message : "Error fetching current user"}, {status : 500});
    }
}
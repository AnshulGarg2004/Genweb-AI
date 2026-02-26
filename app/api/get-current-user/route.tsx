import Users from "@/model/user.model"
import connectDB from "@/lib/connectDB";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const { userId: clerkId } = await auth();

        if(!clerkId) {
            console.log("Clerk ide is null", clerkId);
            return NextResponse.json({success : false, message : "clerk id is null"}, {status : 404});
        }

        await connectDB();

        const user = await Users.findOneAndUpdate(
            { clerkId },
            { $setOnInsert: { clerkId, clerkID: clerkId } },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.log("Error in get-current-user: ", error);
        return NextResponse.json({ success: false, message: "Error fetching current user" }, { status: 500 });
    }
}

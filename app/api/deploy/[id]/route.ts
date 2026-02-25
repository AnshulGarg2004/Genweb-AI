import Users from "@/model/user.model";
import Websites from "@/model/website.model";
import connectDB from "@/lib/connectDB";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    console.log("ID: ", id);
    
    if(!id) {
        console.log('Id is null');
        return NextResponse.json({success : false, message : "Id not found"}, {status : 404})
    }

    try {
        await connectDB();
        const {userId : clerkId} = await auth();
        const user = await Users.findOne({clerkId});
        if(!user) {
            console.log("Canot find user id while deploying");
            return NextResponse.json({success : false, message : "Canot fetch user details"}, {status : 200});
        }
        const website = await Websites.findOne({_id : id, userId : user._id});
        if(!website) {
            console.log("Cannot find website while deploying");
            return NextResponse.json({success : false, message : "Cannot find website while deploying"}, {status : 404});
        }

        if(!website.slug) {
            website.slug = website.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60) + website._id.toString().slice(-5)
        }

        website.deployed = true;
        website.deployedUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`
        await website.save();

        return NextResponse.json({success : true, message : "Website deployed successfully",website,  deployedUrl : website.deployedUrl}, {status : 200});
    } catch (error) {
        console.log("error in deplying");
        return NextResponse.json({success : false, message : "Error in deploying"}, {status : 500});        
    }
}
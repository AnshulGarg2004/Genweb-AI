import Websites from "@/model/website.model"
import connectDB from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    console.log("Slug : ", slug);
    if(!slug) {
        console.log("Slug is required");
        return NextResponse.json({success : false, message : "Slug not found"}, {status : 404});
    }

    
    try {
        await connectDB();
        const website = await Websites.findOne({slug});
        console.log("found website by slug: ", website);
        
        if(!website) {
            console.log("Website not found");
            return NextResponse.json({success : false, message : "Website not present"}, {status : 404});
        }

        return NextResponse.json({success : true, message : "Website found successfully", website}, {status : 200});
    } catch (error) {
        console.log("Error in geting website b id");
        return NextResponse.json({success : false, message : "Error in getting website"}, {status : 500});
    }
}
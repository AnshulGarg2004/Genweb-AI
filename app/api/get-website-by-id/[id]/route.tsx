import Users from "@/model/user.model";
import Websites from "@/model/website.model";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req : NextRequest, {params} : {params : Promise<{id: string}>}) => {
    const {id} = await params;
    try {
        const {userId : clerkId} = await auth();
        const user = await Users.findOne({clerkId});

        if(!user) {
            console.log("Error in fetcing user");
            return NextResponse.json({success : false, message : "Error in fetching user"}, {status : 400});
        }
        
        const website = await Websites.findOne({
            userId : user._id,
            _id : id
        });

        if(!website) {
            console.log("Error in fetching website by id");
            return NextResponse.json({success : false, message : "error in fetching website by id"}, {status  : 400});
        }

        return NextResponse.json({success : true, message : "fetched website by id", website}, {status : 201})
        
    } catch (error) {
        console.log("Error in fetching website by id: ", error);
        return NextResponse.json({success : false, message : "error in fetching website by id"}, {status  : 500});
    }
}
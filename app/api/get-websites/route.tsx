import Websites from "@/model/website.model"
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const websites =  await Websites.find();
        console.log("Websites : ", websites);
        if(!websites) {
            console.log("Cannot find websites");
            return NextResponse.json({success : false, message : "No websites found"}, {status : 404});
        }
        return NextResponse.json({success : true, message : "Websites found successfully", websites}, {status : 200});
    } catch (error) {
        console.log("Error in finding websites: ", error);
        return NextResponse.json({success : false, message : "Error finding websites"}, {status : 500});
    }
}
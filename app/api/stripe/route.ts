import { PLAN } from "@/lib/plan";
import connectDB from "@/lib/connectDB";
import stripe from "@/lib/stripe";
import Users from "@/model/user.model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface PlanProps {
    credits : number;
    plan : string;
    price : number;
}

export const POST = async (req : NextRequest) => {
    try {
        const body = await req.json();
        const planType = typeof body === "string" ? body : body?.planType;
        console.log("Got plan type: ", planType);

        if (!planType || !(planType in PLAN)) {
            return NextResponse.json({success : false, message : "Invalid plan type"}, {status : 400});
        }

        const plan : PlanProps = PLAN[planType as keyof typeof PLAN];

        await connectDB();
        
        const {userId : clerkId} = await auth();
        const user = await Users.findOne({clerkId});

        if(!user) {
            console.log("User not found in stripe");
            return NextResponse.json({success : false, message : "User does not exist in stripe"}, {status : 404});
        }
        
        const session = await stripe.checkout.sessions.create({
            mode : 'payment', 
            payment_method_types : ['card'],
            line_items : [
                {
                    price_data : {
                        currency : 'usd',
                        product_data : {
                            name : `Genweb.AI ${planType.toUpperCase()} plan`
                        },
                        unit_amount : plan.price*100
                    },
                    quantity : 1
                }
            ],

            metadata : {
                userId : String(user._id),
                credits : String(plan.credits),
                plan : plan.plan
            },
            success_url : `${process.env.FRONTEND_URL}`,
            cancel_url : `${process.env.FRONTEND_URL}/pricing`

        });

        return NextResponse.json({success : true, message : "stripe loaded", sessionUrl : session.url}, {status : 200});
        
    } catch (error) {
        console.log("Error in stripe:", error);
        return NextResponse.json({success : false, message : "Error in setting up stripe"}, {status : 500});
    }
}
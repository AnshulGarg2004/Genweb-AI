import stripe from "@/lib/stripe";
import connectDB from "@/lib/connectDB";
import Users from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req : NextRequest) => {
    const sign = req.headers.get("stripe-signature");
    const payload = await req.text();
    let event;

    if(!sign) {
        return NextResponse.json({success : false, message : "Sign is required"}, {status : 500});
    }
    try {

        event = stripe.webhooks.constructEvent(payload, sign, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
        console.log("Error in webhook: ", error);
        return NextResponse.json({success : false, message : "Error in webhook"}, {status : 500});
    }
    if(event.type === 'checkout.session.completed') {
        await connectDB();

        const session = event.data.object;
        const userId = session?.metadata?.userId;
        const credits = Number(session?.metadata?.credits);
        const plan = session?.metadata?.plan;

        if (!userId || Number.isNaN(credits)) {
            return NextResponse.json({success : false, message : "Invalid webhook metadata"}, {status : 400});
        }

        await Users.findByIdAndUpdate(userId, {
            $inc : { credits: credits },
            $set : { plan: plan }
        });

    }

    return NextResponse.json({success : true,received : true,  message : "Webhook processed"}, {status : 200});
}
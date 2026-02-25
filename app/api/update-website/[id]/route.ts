import { generateResponse } from "@/config/openRouter";
import Users from "@/model/user.model";
import Websites from "@/model/website.model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const {prompt} = await req.json();
    console.log("Prompt for updating code: ", prompt);

    if (!prompt) {
        return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
    }

    const paramsId = await params;
    const id = paramsId.id;

    console.log("Id in update website of website: ", id);

    if (!id) {
        return NextResponse.json({ success: false, message: "Id is required" }, { status: 400 });
    }


    try {
        const { userId: clerkId } = await auth();
        const existingUser = await Users.findOne({ clerkId });
        if (!existingUser) {
            console.log("Canot find existing user while updating");
            return NextResponse.json({ success: false, message: "Cannot find user while updating" }, { status: 401 });
        }

        if (existingUser.credits < 25) {
            console.log("you dont have sufficent credits");
            return NextResponse.json({ success: false, message: "Insufficent credits" }, { status: 401 });

        }

        const website = await Websites.findOne({ _id: id, userId: existingUser._id });
        const updatePrompt = `
You are a senior frontend developer and HTML expert.

Your task is to update the provided HTML code according to the USER PROMPT.

-------------------------
CURRENT CODE:
${website.latestCode}
-------------------------

USER REQUIREMENTS:
${prompt}
-------------------------

INSTRUCTIONS:

1. Carefully analyze the user's requirements.
2. Modify the HTML accordingly.
3. Keep existing structure unless the user explicitly asks to change it.
4. Ensure the final HTML is valid, clean, properly indented, and production-ready.
5. Do NOT remove functionality unless requested.
6. Do NOT include explanations outside the JSON.
7. Do NOT wrap the response in markdown.
8. Do NOT include \`\`\` or any extra text.
9. Return ONLY valid raw JSON.
10. The "code" field must contain FULL updated HTML.

RESPONSE FORMAT (STRICT):

{
  "message": "Short explanation of what was updated",
  "code": "<FULL VALID UPDATED HTML HERE>"
}

IMPORTANT:
- The response must be valid JSON.
- Escape quotes properly inside the HTML.
- No comments outside JSON.
- No extra keys.
- No trailing commas.
`;


        const response = await generateResponse(updatePrompt);
        if (!response) {
            console.log('Error in getting response');
            return NextResponse.json({ success: false, message: 'Error in getting response' }, { status: 400 });
        }
        console.log("Response from updating website: ", response);

        const rawResult = response.choices?.[0]?.message?.content ?? null;
        const cleanedText = typeof rawResult === "string"
            ? rawResult.replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim()
            : rawResult;

        let cleanedResult = cleanedText as { code?: string; message?: string } | null;
        if (typeof cleanedText === "string") {
            try {
                cleanedResult = JSON.parse(cleanedText);
            } catch (parseError) {
                cleanedResult = null;
            }
        }

        console.log("updated website result : ", cleanedResult);

        if (!cleanedResult?.code) {
            console.log("No valid content in response");
            return NextResponse.json({ success: false, message: "No valid content in response" }, { status: 400 });
        }

        website.latestCode = cleanedResult.code;
        website.conversation.push({
            role : "user",
            content : prompt
        }, {
            role : "ai",
            content : cleanedResult.message
        })
        await website.save();

        existingUser.credits -= 25;

        await existingUser.save();


        return NextResponse.json({success : true, message : "Updated website successfully", userCredits : existingUser.credits, website }, {status : 200})


    } catch (error) {
        return NextResponse.json({success : false, message : "An error occured while updating the website "}, {status : 500})
    }

}
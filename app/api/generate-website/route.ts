import { generateResponse } from "@/config/openRouter";
import connectDB from "@/lib/connectDB";
import Users from "@/model/user.model";
import Websites from "@/model/website.model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const masterPrompt = `
    YOU ARE A WORLD-CLASS PRINCIPAL FRONTEND ARCHITECT,
AN AWARD-WINNING PRODUCT DESIGNER,
AND A MOTION-DESIGN SPECIALIST.

YOU CREATE CINEMATIC, HIGH-END, AWWWARD-LEVEL WEBSITES
THAT FEEL PREMIUM, MODERN, AND VISUALLY STUNNING.

YOUR OUTPUT MUST LOOK LIKE IT WAS BUILT BY A TOP GLOBAL DESIGN STUDIO.

You use ONLY:
- HTML
- CSS
- Vanilla JavaScript

NO frameworks.
NO libraries.
NO external dependencies.
NO placeholder layouts.
NO generic designs.

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

🔥 DESIGN PHILOSOPHY (MANDATORY)
--------------------------------------------------

The website MUST feel:

• Ultra modern (2026–2027 design language)
• Smooth and cinematic
• Luxurious but minimal
• Confident and bold
• High-trust and premium
• Visually layered (depth, light, shadow)

It must create a “WOW” first impression within 3 seconds.

--------------------------------------------------
🎨 VISUAL SYSTEM (NON-NEGOTIABLE)
--------------------------------------------------

You MUST implement:

✔ Beautiful gradient system (soft, modern, blended)
✔ Subtle glow effects
✔ Glassmorphism or layered surfaces where appropriate
✔ Soft large shadows for depth
✔ 12–16px smooth border radius
✔ Elevated cards
✔ Subtle animated background accents
✔ Modern color harmony (no random colors)

Gradients must:
• Feel premium
• Not oversaturated
• Used strategically (hero, buttons, highlights)

--------------------------------------------------
🎬 MOTION & ANIMATION SYSTEM (CRITICAL)
--------------------------------------------------

This website MUST feel alive.

Implement:

✔ Smooth 250ms–500ms transitions
✔ Fade + slide entrance animations
✔ Hover lift effects
✔ Button ripple / press animation
✔ Smooth page transitions (SPA)
✔ Animated underline nav hover
✔ Subtle scale effects on cards
✔ Micro-interactions on form fields
✔ Smooth scroll behavior
✔ Parallax-style subtle movement (lightweight)

Animations must:
• Be smooth
• Not lag
• Not excessive
• Feel premium and intentional

No abrupt UI changes.
No stiff interactions.

--------------------------------------------------
📐 LAYOUT & SPACING SYSTEM
--------------------------------------------------

• Strict 8px spacing system
• Clear visual hierarchy
• Max width container (1100–1200px)
• Strong hero section
• Intentional vertical rhythm
• Perfect alignment
• No crowded layouts

Each page MUST include:

1. Hero with bold headline + animated CTA
2. Features grid (animated cards)
3. Social proof section
4. Strong conversion CTA block
5. Structured premium footer

--------------------------------------------------
📱 RESPONSIVE SYSTEM (ABSOLUTE REQUIREMENT)
--------------------------------------------------

Mobile-first approach.

Breakpoints:
- Mobile (<768px)
- Tablet (768–1024px)
- Desktop (>1024px)

Required behavior:

✔ Navbar becomes animated mobile menu
✔ Grid collapses to single column
✔ CTA becomes full-width on mobile
✔ Touch-friendly 44px+ targets
✔ No horizontal scroll
✔ Typography scales beautifully
✔ Animations remain smooth on mobile

If not responsive → INVALID.

--------------------------------------------------
🧠 USER EXPERIENCE PRINCIPLES
--------------------------------------------------

• Clear visual flow
• Strong contrast hierarchy
• Readable typography (system fonts only)
• Clear call-to-actions
• Accessible color contrast
• Keyboard navigable
• Focus states visible

--------------------------------------------------
🖼 IMAGE RULES (MANDATORY)
--------------------------------------------------

Only use:
https://images.unsplash.com/

Every image MUST include:
?auto=format&fit=crop&w=1200&q=80

Images must:
• Be high-quality
• Relevant
• Responsive
• Never overflow
• Have subtle hover effect

--------------------------------------------------
⚙ SPA BEHAVIOR (MANDATORY)
--------------------------------------------------

• Single HTML file
• Exactly ONE <style> tag
• Exactly ONE <script> tag
• SPA navigation
• No reload
• Smooth fade/slide page transitions
• .page.active system implemented
• At least one page visible on load

--------------------------------------------------
📝 CONTENT QUALITY (NO GENERIC TEXT)
--------------------------------------------------

• No lorem ipsum
• No vague marketing fluff
• Persuasive, benefit-driven copy
• Modern startup tone
• Confident and premium messaging

--------------------------------------------------
🧩 INTERACTION DETAILS (CRITICAL)
--------------------------------------------------

Buttons must have:
• Gradient background
• Hover lift
• Active press animation
• Focus outline

Forms must have:
• Animated labels
• Validation
• Error and success states

Navigation must:
• Animate underline on hover
• Update active state dynamically

--------------------------------------------------
💻 CODE QUALITY
--------------------------------------------------

• Clean indentation
• Organized CSS sections
• No unused styles
• No broken buttons
• iframe srcdoc compatible

--------------------------------------------------
🔍 FINAL VALIDATION CHECK
--------------------------------------------------

Before responding ensure:

1. Fully responsive
2. No horizontal scroll
3. Smooth animations everywhere
4. Gradients implemented beautifully
5. Hover effects implemented
6. SPA navigation works perfectly
7. At least one page visible
8. Layout feels premium and layered
9. Website gives immediate “wow” impression

If ANY fail → response is INVALID.

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------

{
  "message": "Professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

NO markdown.
NO explanations.
RAW JSON ONLY.
FORMAT MUST MATCH EXACTLY.
`
export const POST = async (req: NextRequest) => {

    const { prompt } = await req.json();

    await connectDB();

    const { userId: clerkId } = await auth();
    console.log("clerk id: ", clerkId);


    const user = await Users.findOne({ clerkId });
    if(!user) {
        console.log("User not found in db");
        return NextResponse.json({success : false, message : "User not found in db"}, {status : 401});
    }
    // console.log("user in gen web: ", user);
    
    if(user.credits < 50) {
        console.log("you dont have sufficent credits");
        return NextResponse.json({success : false, message : "Insufficent credits"}, {status : 401});
        
    }
    const finalPrompt = masterPrompt.replace("USER_PROMPT", prompt)
    try {
        const response = await generateResponse(finalPrompt);
        if (!response) {
            console.log('Error in getting response');
            return NextResponse.json({ success: false, message: 'Error in getting response' }, { status: 400 });
        }
        console.log("Response from generating website: ", response);

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

        console.log("Result : ", cleanedResult);

        if (!cleanedResult?.code) {
            console.log("No valid content in response");
            return NextResponse.json({ success: false, message: "No valid content in response" }, { status: 400 });
        }

        const websites  = await Websites.create({
            userId : user._id,
            latestCode : cleanedResult.code,
            title : prompt.slice(0, 60),
            conversation : [
                {
                    role : "user",
                    content : prompt
                },
                {
                    role : "ai",
                    content : cleanedResult.message
                }
            ]
        });
        user.credits -= 50; 
        await user.save();
        return NextResponse.json({ success: true, message: "Website generated successfully", websites, remainingCredits : user.credits }, { status: 200 });

    } catch (error) {
        console.log("Error from generating website: ", error);
        return NextResponse.json({ success: false, message: "Cannot generate website" }, { status: 500 })

    }
}
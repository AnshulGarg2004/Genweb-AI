const oprnRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
const model = "deepseek/deepseek-chat";

export const generateResponse = async (prompt: string) => {
    try {
        const response = await fetch(oprnRouterUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role : 'system',
                        content : "you must return only valid raw json"
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature : 0.2
            }),
        });

        if(!response.ok) {
            console.log("Error in openrouter: ", response.statusText);
            return null;
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.log("Error got from openRouter: ", error);
        return null;
    }
}
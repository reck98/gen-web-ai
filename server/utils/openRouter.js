import { MODEL_NAME, OPENROUTER_API_KEY, OPENROUTER_URL } from "./config.js";

export const generateRespone = async (prompt) => {
    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: [
                {
                    role: "system",
                    content: "You must return ONLY valid raw JSON",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.2,
        }),
    });

    if (!response.ok) {
        const error = await response.text();

        throw new Error(`OpenRouter Error : ${error}`);
    }

    const data = await response.json();

    return data.choices[0].message.content;
};

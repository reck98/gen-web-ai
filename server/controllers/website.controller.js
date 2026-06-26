import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import { SYSTEM_PROMPT } from "../utils/config.js";
import extractJson from "../utils/extractJson.js";
import { generateRespone } from "../utils/openRouter.js";

export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            res.status(400).json({
                message: "prompt is required",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (user.credits < 50) {
            res.status(402).json({
                message: "Not enough credits",
            });
        }

        const finalPrompt = SYSTEM_PROMPT.replace("USER_PROMPT", prompt);
        let raw = "";
        let parsed = null;

        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateRespone(finalPrompt);
            parsed = await extractJson(raw);

            if (!parsed) {
                raw = await generateRespone(
                    finalPrompt + "\n\n RETURN ONLY VALID JSON",
                );

                parsed = await extractJson(raw);
            }
        }

        if (!parsed.code) {
            console.log("AI returned invalid response", raw);
            res.status(500).json({
                message: "AI returned invalid response",
            });
        }

        const website = await Website.create({
            user: user._id,
            title: prompt.slice(0, 60),
            latestCode: parsed.code,
            conversations: [
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "ai",
                    content: parsed.message,
                },
            ],
        });

        user.credits -= 50;
        await user.save();

        return res.status(200).json({
            websiteId: website._id,
            remainingCredits: user.credits,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: `Generate Website Error : ${error}`,
        });
    }
};

export const getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!website) {
            return res.status(404).json({
                message: "Website not found",
            });
        }

        return res.status(200).json(website);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Get Website By Id Error : ${error}`,
        });
    }
};

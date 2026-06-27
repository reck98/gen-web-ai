import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import { FRONTEND_URL, SYSTEM_PROMPT } from "../utils/config.js";
import extractJson from "../utils/extractJson.js";
import { generateRespone } from "../utils/openRouter.js";

export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                message: "prompt is required",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (user.credits < 50) {
            return res.status(402).json({
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

        if (!parsed || !parsed.code) {
            console.log("AI returned invalid response", raw);
            return res.status(500).json({
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
        return res.status(500).json({
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

export const changes = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                message: "prompt is required",
            });
        }

        const websiteId = req.params.id;

        const website = await Website.findOne({
            _id: websiteId,
            user: req.user._id,
        });

        if (!website) {
            return res.status(404).json({
                message: "Website not found",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (user.credits < 25) {
            return res.status(402).json({
                message: "Not enough credits",
            });
        }

        let UPDATE_PROMPT = `
            UPDATE THIS HTML WEBSITE.

            CURRENT CODE:
            ${website.latestCode}

            USER REQUEST:
            ${prompt}

            RETURN RAW JSON ONLY:
            {
                "message": "Short confirmation",
                "code": "<UPDATED FULL HTML>"
            }
            `;

        let raw = "";
        let parsed = null;

        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateRespone(UPDATE_PROMPT);
            parsed = await extractJson(raw);

            if (!parsed) {
                raw = await generateRespone(
                    UPDATE_PROMPT + "\n\n RETURN ONLY VALID JSON",
                );

                parsed = await extractJson(raw);
            }
        }

        if (!parsed || !parsed.code) {
            console.log("AI returned invalid response", raw);
            return res.status(500).json({
                message: "AI returned invalid response",
            });
        }

        website.conversations.push({
            role: "user",
            content: prompt,
        });

        website.conversations.push({
            role: "ai",
            content: parsed.message,
        });

        website.latestCode = parsed.code;
        user.credits -= 25;

        await user.save();
        await website.save();

        return res.status(200).json({
            message: parsed.message,
            code: parsed.code,
            remainingCredits: user.credits,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Changes Error : ${error}`,
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const websites = await Website.find({ user: req.user._id });

        return res.status(200).json(websites);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Get All Error : ${error}`,
        });
    }
};

export const deploy = async (req, res) => {
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

        if (!website.slug) {
            website.slug =
                website.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "")
                    .slice(0, 60) +
                "-" +
                website._id.toString().slice(-5);
        }
        website.deployed = true;

        website.deployedUrl = `${FRONTEND_URL}/site/${website.slug}`;

        await website.save();

        return res.status(200).json({
            url: website.deployedUrl,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Deploy Error : ${error}`,
        });
    }
};

export const getWebsiteBySlug = async (req, res) => {
    try {
        const website = await Website.findOne({
            slug: req.params.slug,
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
            error: `Get By Slug Error : ${error}`,
        });
    }
};

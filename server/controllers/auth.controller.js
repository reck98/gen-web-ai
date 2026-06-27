import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";

export const googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;

        if (!email) {
            res.status(400).json({ message: "Email is required" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ name, email, avatar });
        } else {
            user.avatar = avatar;
            await user.save();
        }

        const token = await jwt.sign(
            {
                id: user._id,
            },
            JWT_SECRET,
            { expiresIn: "7d" },
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "User logged in successfully",
            user: user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: "Google Auth Error",
        });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: "Log Out Error",
        });
    }
};

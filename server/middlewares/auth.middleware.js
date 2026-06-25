import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = await jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        req.user = await User.findById(userId);

        next();
    } catch (error) {
        console.log(`isAuth error: ${error}`);
    }
};

export default isAuth;

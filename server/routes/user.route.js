import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import isAuth from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/me", isAuth, getCurrentUser);
// userRouter.get("/demo", generateDemo);

export default userRouter;

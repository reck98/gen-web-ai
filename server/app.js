import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { FRONTEND_URL } from "./utils/config.js";
import userRouter from "./routes/user.route.js";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;

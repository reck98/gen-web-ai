import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { FRONTEND_URL } from "./utils/config.js";
import userRouter from "./routes/user.route.js";
import morgan from "morgan";
import websiteRouter from "./routes/website.route.js";
import billingRouter from "./routes/billing.route.js";
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js";

const app = express();

app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook,
);

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
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);

export default app;

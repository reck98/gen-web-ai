import express from "express";
import { generateWebsite, getWebsiteById } from "../controllers/website.controller.js";
import isAuth from "../middlewares/auth.middleware.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, generateWebsite);
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);

export default websiteRouter;

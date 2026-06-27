import express from "express";
import {
    changes,
    deploy,
    generateWebsite,
    getAll,
    getWebsiteById,
    getWebsiteBySlug,
} from "../controllers/website.controller.js";
import isAuth from "../middlewares/auth.middleware.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, generateWebsite);
websiteRouter.post("/update/:id", isAuth, changes);

websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.get("/get-by-slug/:slug", getWebsiteBySlug);
websiteRouter.get("/get-all", isAuth, getAll);
websiteRouter.get("/deploy/:id", isAuth, deploy);

export default websiteRouter;

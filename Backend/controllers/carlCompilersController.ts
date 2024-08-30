import express from "express";
import { renderPageFromHtmlFile } from "../services/pageLayout";
import { getUserFromRequest } from "../services/authorizationService";

export const CarlCompilersRouter = express.Router();
export const CarlCompilersRoute = "carlCompilers";

CarlCompilersRouter.get("/simple", async (req, res) => {
    try {
        res.send(await renderPageFromHtmlFile("Backend/views/", "simple", req));
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

CarlCompilersRouter.get("/ide", async (req, res) => {
    try {
        await getUserFromRequest(req, true);
        res.send(await renderPageFromHtmlFile("Backend/views/", "ide", req));
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

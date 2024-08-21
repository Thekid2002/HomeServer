import express from "express";
import {renderPageFromHtmlFile} from "../services/pageLayout.js";
import {checkIsLoggedIn} from "../services/authorizationService.js";

export const CarlCompilersRouter = express.Router();
export const CarlCompilersRoute = 'carlCompilers';

CarlCompilersRouter.get("/simple",  async (req, res) => {
    try {
        res.send(await renderPageFromHtmlFile("Backend/views/", "simple", req));
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

CarlCompilersRouter.get("/ide", async (req, res) => {
    try {
        await checkIsLoggedIn(req.role, req.token);
        res.send(await renderPageFromHtmlFile("Backend/views/", "ide", req));
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});




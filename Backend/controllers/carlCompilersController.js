import express from "express";
import {renderPageFromHtmlFile} from "../services/pageLayout.js";
import {checkIsLoggedIn} from "../services/authorizationService.js";

export const CarlCompilersRouter = express.Router();
export const CarlCompilersRoute = 'carlCompilers';

CarlCompilersRouter.get("/simple", (req, res) => {
    try {
        checkIsLoggedIn(req);
        res.send(renderPageFromHtmlFile("Backend/views/", "simple", req));
    } catch (e) {
        console.error(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

CarlCompilersRouter.get("/ide", (req, res) => {
    try {
        checkIsLoggedIn(req);
        res.send(renderPageFromHtmlFile("Backend/views/", "ide", req));
    } catch (e) {
        console.error(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});




import express from "express";
import {renderPage} from "../services/pageLayout.js";

export const CarlCompilersRouter = express.Router();
export const CarlCompilersRoute = 'carlCompilers';

CarlCompilersRouter.get("/simple", (req, res) => {
    res.send(renderPage("Backend/views/", "simple"));
});

CarlCompilersRouter.get("/ide", (req, res) => {
    res.send(renderPage("Backend/views/", "ide"));
});




import express from 'express';
import {renderPageFromHtmlFile} from "../services/pageLayout.js";

export const NotFoundController = express.Router();
export const NotFoundRoute = '404';

NotFoundController.get("*", (req, res) => {
    res.send(renderPageFromHtmlFile("Backend/views/", NotFoundRoute, req));
});
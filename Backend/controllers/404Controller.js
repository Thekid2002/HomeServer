import express from 'express';
import {renderPage} from "../services/pageLayout.js";

export const NotFoundController = express.Router();
export const NotFoundRoute = '404';

NotFoundController.get("*", (req, res) => {
    res.send(renderPage("Backend/views/", NotFoundRoute));
});
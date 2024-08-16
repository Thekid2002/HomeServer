import express from "express";
import {renderPage} from "../services/pageLayout.js";
export const CarlInstructionsRouter = express.Router();
export const CarlInstructionsRoute = 'carlInstructions';

CarlInstructionsRouter.get("*", (req, res) => {
    res.send(renderPage("Backend/views/", "carlInstructions", "utf8"));
});
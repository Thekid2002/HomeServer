import express from "express";
import { renderPageFromHtmlFile } from "../services/pageLayout";
export const CarlInstructionsRouter = express.Router();
export const CarlInstructionsRoute = "carlInstructions";

CarlInstructionsRouter.get("*", async (req, res) => {
    try {
        res.send(
            await renderPageFromHtmlFile("Backend/views/", "carlInstructions", req)
        );
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

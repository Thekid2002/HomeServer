import express from "express";
import {renderPageFromHtmlFile} from "../services/pageLayout.js";
import {checkIsAuthorizedWithRoles, checkIsLoggedIn} from "../services/authorizationService.js";
export const CarlInstructionsRouter = express.Router();
export const CarlInstructionsRoute = 'carlInstructions';

CarlInstructionsRouter.get("*", (req, res) => {
    try{
        res.send(renderPageFromHtmlFile("Backend/views/", "carlInstructions", req));
    } catch (e){
        console.error(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});
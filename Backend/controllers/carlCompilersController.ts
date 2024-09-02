import express from "express";
import {renderPageFromHtmlFile, renderPageWithBasicLayout} from "../services/pageLayout";
import { getUserFromRequest } from "../services/authorizationService";
import {getRepositoryPickerPage} from "../services/carlCompilerService";

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
        const user = await getUserFromRequest(req, true);
        res.send(await renderPageWithBasicLayout("IdePicker", "IDE Picker", await getRepositoryPickerPage(user!, req), req));
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

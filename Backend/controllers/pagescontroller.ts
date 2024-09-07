import express from "express";
import {
    renderPageFromHtmlFile,
    renderPageObjectCreateEditPage,
    renderPageWithBasicLayout,
    renderTablePageWithBasicLayout
} from "../services/pageLayout";
import {
    createPage,
    deletePage,
    getAllPages,
    getPageById,
    getPageByPageUrl,
    updatePage
} from "../repositories/pageRepository";
import { NotFoundError } from "../errors/notFoundError";
import { getPagesLayout } from "../services/tableLayoutService";
import { checkIsAuthorizedWithRoles } from "../services/authorizationService";
import { RoleEnum } from "../models/roleEnum";

export const PagesRouter = express.Router();
export const PagesRoute = "pages";

PagesRouter.get("/", async (req, res) => {
    try {
        const pages = await getAllPages();
        const layout = getPagesLayout(false);
        const canEditAndDelete = await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ], false);
        res.send(
            await renderTablePageWithBasicLayout("pages", "All Pages", pages, layout, req,  canEditAndDelete, canEditAndDelete)
        );
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

PagesRouter.get("/create", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const layout = getPagesLayout(true);
        res.send(
            await renderPageObjectCreateEditPage("CreatePage", "Create Page", null, layout, req, true)
        );
    } catch (e) {
        console.error(e);
        if (e instanceof NotFoundError) {
            res.send(await renderPageFromHtmlFile("Backend/views/", "404", req));
        } else {
            res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
        }
    }
});

PagesRouter.get("/edit?:id", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const queryId = req.query.id as string;
        if (!queryId) {
            throw new Error("ID is required");
        }
        const id = parseInt(queryId);
        const page = await getPageById(id);
        if (!page) {
            throw new NotFoundError("Page not found");
        }
        const layout = getPagesLayout(false);
        res.send(
            await renderPageObjectCreateEditPage("EditPage", "Edit Page", page, layout, req, false)
        );
        return;
    } catch (e) {
        console.error(e);
        if (e instanceof NotFoundError) {
            res.send(await renderPageFromHtmlFile("Backend/views/", "404", req));
        } else {
            res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
        }
    }
});

PagesRouter.get("/:pageUrl", async (req, res) => {
    try {
        const pageUrl = req.params.pageUrl;
        const page = await getPageByPageUrl(PagesRoute + "/" + pageUrl);
        if (!page) {
            throw new NotFoundError("Page not found");
        }
        res.send(
            await renderPageWithBasicLayout(page.pageName, page.title, page.body, req, page.stylesheets, page.scripts)
        );
    } catch (e) {
        console.error(e);
        if (e instanceof NotFoundError) {
            res.send(await renderPageFromHtmlFile("Backend/views/", "404", req));
        } else {
            res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
        }
    }
});

PagesRouter.post("/edit?:id", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const queryId = req.query.id as string;
        if (!queryId) {
            throw new Error("ID is required");
        }
        const id = parseInt(queryId);
        const page = req.body;
        page.id = id;
        await updatePage(page);
        res.send("Page updated");
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

PagesRouter.post("/create", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const page = req.body;
        await createPage(page);
        res.send("Page created");
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

PagesRouter.delete("/:id", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const queryId = req.query.id as string;
        if (!queryId) {
            throw new Error("ID is required");
        }
        const id = parseInt(queryId);
        await deletePage(id);
        res.send(await getAllPages());
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});
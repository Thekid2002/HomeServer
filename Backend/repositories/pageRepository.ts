import { Page } from "../models/page";
import { log } from "../services/logger";

export async function getAllPages(): Promise<Page[]> {
    log("Finding all pages");

    const pages = await Page.findAll();

    return pages;
}

export async function getPageByPageUrl(pageUrl: string): Promise<Page | null> {
    if (!pageUrl) {
        throw new Error("Page URL is required");
    }

    log("Finding page by URL: " + pageUrl);

    const page = await Page.findOne({
        where: { pageUrl }
    });

    return page;
}

export async function getPageById(id: number): Promise<Page | null> {
    log("Finding page by ID: " + id);

    const page = await Page.findByPk(id);

    return page;
}

export async function createPage(page: Page): Promise<Page> {
    log("Creating page");
    if (!page.pageUrl.includes("pages/")) {
        page.pageUrl = "pages/" + page.pageUrl;
    }
    page.stylesheets = page.stylesheets ?? [];
    page.scripts = page.scripts ?? [];
    const newPage = await Page.create(page);

    return newPage;
}

export async function updatePage(page: Page): Promise<Page> {
    log("Updating page");

    await Page.update(page, {
        where: { id: page.id }
    });

    return page;
}

export async function deletePage(id: number): Promise<void> {
    log("Deleting page");

    await Page.destroy({
        where: { id }
    });
}
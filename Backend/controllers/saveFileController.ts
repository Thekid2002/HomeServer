import express from "express";
import {
    renderPageFromHtmlFile,
    renderPageObjectCreateEditPage
} from "../services/pageLayout";
import { checkIsAuthorizedWithRoles, getUserFromRequest } from "../services/authorizationService";
import { RoleEnum } from "../models/roleEnum";
import { NotFoundError } from "../errors/notFoundError";
import { getSaveFileLayout } from "../services/tableLayoutService";
import { NotAuthorizedError } from "../errors/notAuthorizedError";
import {
    findRepositoryById,
    getAllRepositories, getAllRepositoriesByUserId
} from "../repositories/repositoryRepository";
import {
    createSaveFile,
    deleteSaveFile,
    findSaveFileById,
    updateSaveFile
} from "../repositories/saveFileRepository";
import { mapSaveFilesToSaveFileDtoList } from "../services/mapper";
import { User } from "../models/user";
import { SaveFile } from "../models/saveFile";
import { sequelize } from "../services/database";
import { Repository } from "../models/repository";

export const SaveFileRouter = express.Router();
export const SaveFileRoute = "saveFile";

SaveFileRouter.get("/get", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN ],
            true
        );
        const queryRepositoryId = req.query.repositoryId;
        if (!queryRepositoryId || queryRepositoryId !instanceof String) {
            throw new Error("No repository id provided");
        }
        const repositoryId = parseInt(queryRepositoryId as string);
        const repository = await findRepositoryById(repositoryId) as Repository;
        const activeUser = await getUserFromRequest(req, true) as User;
        if (
            repository &&
      repository.userId !== activeUser.id &&
      activeUser.role !== RoleEnum.SUPER_ADMIN
        ) {
            throw new NotAuthorizedError("Unauthorized");
        }
        res.send(await mapSaveFilesToSaveFileDtoList(await repository.getSaveFiles(), repository));
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

SaveFileRouter.get("/edit", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN ],
            true
        );
        const activeUser = await getUserFromRequest(req, true) as User;
        const queryId = req.query.id;
        if (!queryId || queryId !instanceof String) {
            throw new Error("No id provided");
        }
        const id = parseInt(queryId as string);
        const title = id ? "Edit Save File" : "Create Save File";
        const queryRepositoryId = req.query.repositoryId;
        if (!queryRepositoryId || queryRepositoryId !instanceof String) {
            throw new Error("No repository id provided");
        }
        const repositoryId = parseInt(queryRepositoryId as string);
        const repository: Repository = await findRepositoryById(repositoryId, true) as Repository;
        let file: SaveFile | null = null;
        if (id) {
            file = await findSaveFileById(id);
        }
        const layout = getSaveFileLayout();

        res.send(
            await renderPageObjectCreateEditPage(
                "CreateEditSaveFile",
                title,
                file,
                layout,
                req
            )
        );
    } catch (e) {
        console.error(e);
        if (e instanceof NotFoundError) {
            return res.send(
                await renderPageFromHtmlFile("Backend/views/", "500", req)
            );
        }
        return res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

SaveFileRouter.post("/edit", async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN ],
            true
        );
        const queryId = req.query.id;
        if (!queryId || queryId !instanceof String) {
            throw new Error("No id provided");
        }
        const id = parseInt(queryId as string);
        const name = req.body.name;
        const path = req.body.path;
        const content = req.body.content;
        const queryRepositoryId = req.query.repositoryId;
        if (!queryRepositoryId || queryRepositoryId !instanceof String) {
            throw new Error("No repository id provided");
        }
        const repositoryId = parseInt(queryRepositoryId as string);
        const repository = await findRepositoryById(repositoryId) as Repository;
        const activeUser = await getUserFromRequest(req, true) as User;

        if (
            repository &&
      repository.userId !== activeUser.id &&
      activeUser.role !== RoleEnum.SUPER_ADMIN
        ) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if (id) {
            const saveFile = await findSaveFileById(id, true) as SaveFile;
            saveFile.name = name;
            saveFile.path = path;
            saveFile.content = content;
            await updateSaveFile(saveFile);
        } else {
            await createSaveFile(name, path, content, repository.id, transaction);
        }

        res.send("Save File updated");
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

SaveFileRouter.delete("/delete", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN ],
            true
        );
        const activeUser = await getUserFromRequest(req, true) as User;
        const queryId = req.query.id;
        if (!queryId || queryId !instanceof String) {
            throw new Error("No id provided");
        }
        const id = parseInt(req.query.id as string);
        const queryRepositoryId = req.query.repositoryId;
        if (!queryRepositoryId || queryRepositoryId !instanceof String) {
            throw new Error("No repository id provided");
        }
        const repositoryId = parseInt(queryRepositoryId as string);
        const repository = await findRepositoryById(repositoryId);

        if (
            repository &&
      repository.userId !== activeUser.id &&
      activeUser.role !== RoleEnum.SUPER_ADMIN
        ) {
            throw new NotAuthorizedError("Unauthorized");
        }

        await deleteSaveFile(id);
        res.send("Save File deleted");
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

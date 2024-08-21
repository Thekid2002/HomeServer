import express from "express";
import {renderPageFromHtmlFile, renderPageObjectCreateEditPage} from "../services/pageLayout.js";
import {checkIsAuthorizedWithRoles} from "../services/authorizationService.js";
import {roleEnum} from "../models/role.js";
import {NotFoundError} from "../errors/notFoundError.js";
import {getSaveFileLayout} from "../services/tableLayoutService.js";
import {getActiveUser} from "../services/userService.js";
import {NotAuthorizedError} from "../errors/notAuthorizedError.js";
import {findRepositoryById, getAllRepositories} from "../repositories/repositoryRepository.js";
import {
    createSaveFile,
    deleteSaveFile,
    getAllSaveFiles,
    getAllSaveFilesByRepositoryId,
    updateSaveFile
} from "../repositories/saveFileRepository.js";
import {mapSaveFilesToSaveFileDtoList} from "../services/mapper.js";

export const SaveFileRouter = express.Router();
export const SaveFileRoute = 'saveFile';

SaveFileRouter.get("/get",  async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const repositoryId = parseInt(req.query.repositoryId);
        const repository = (await findRepositoryById(repositoryId)).dataValues;
        const activeUser = (await getActiveUser(req.token)).dataValues;
        if (repository && repository.userId !== activeUser.id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }
        res.send(await mapSaveFilesToSaveFileDtoList(repository.saveFiles));
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

SaveFileRouter.get("/edit", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        const title = id ? "Edit Save File" : "Create Save File";
        const repositoryId = parseInt(req.query.repositoryId);
        const repository = getAllRepositories().find(repo => repo.id === repositoryId);
        let file = getAllSaveFiles().find(file => file.id === id);
        let layout = getSaveFileLayout();

        if (!repository && repository.userId !== getActiveUser(req.token).id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        res.send(await renderPageObjectCreateEditPage("CreateEditSaveFile", title, file, layout, req));
    } catch (e) {
        console.error(e);
        if(e instanceof NotFoundError){
            return res.send(await renderPageFromHtmlFile("Backend/views/", "500", req));
        }
        return res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

SaveFileRouter.post("/edit", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        const name = req.body.name;
        const path = req.body.path;
        const content = req.body.content;
        const repositoryId = parseInt(req.query.repositoryId);
        const repository = getAllRepositories().find(repo => repo.id === repositoryId);

        if (repository && repository.userId !== getActiveUser(req.token).id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if(id) {
            let saveFile = getAllSaveFiles().find(file => file.id === id);
            saveFile.name = name;
            saveFile.path = path;
            saveFile.content = content;
            await updateSaveFile(saveFile);
        }else {
            await createSaveFile(name, path, content, repository.id);
        }

        res.send("Save File updated");
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

SaveFileRouter.delete("/delete", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        const repositoryId = parseInt(req.query.repositoryId);
        const repository = getAllRepositories().find(repo => repo.id === repositoryId);

        if (repository && repository.userId !== getActiveUser(req.token).id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        await deleteSaveFile(id);
        res.send("Save File deleted");
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
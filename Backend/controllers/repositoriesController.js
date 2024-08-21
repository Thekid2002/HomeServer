import express from 'express';
import {
    renderIdePageWithBasicLayout,
    renderPageFromHtmlFile,
    renderPageObjectCreateEditPage,
    renderTablePageWithBasicLayout
} from "../services/pageLayout.js";
import {checkIsAuthorizedWithRoles} from "../services/authorizationService.js";
import {roleEnum} from "../models/role.js";
import {getActiveUser} from "../services/userService.js";
import {mapRepositoryListToRepositoryDtoList, mapRepositoryToRepositoryDto} from "../services/mapper.js";
import {getRepositoryLayout} from "../services/tableLayoutService.js";
import {NotAuthorizedError} from "../errors/notAuthorizedError.js";
import {
    createRepository,
    deleteRepository, findRepositoryById,
    getAllRepositories,
    updateRepository
} from "../repositories/repositoryRepository.js";
import {NotFoundError} from "../errors/notFoundError.js";
import {getAllSaveFiles, getAllSaveFilesByRepositoryId, updateSaveFile} from "../repositories/saveFileRepository.js";
import {findUserByToken, getAllUsers} from "../repositories/userRepository.js";
import {RepositoryDto} from "../dto/repositoryDto.js";

export const RepositoriesRouter = express.Router();
export const RepositoriesRoute = 'repositories';

RepositoriesRouter.get("/all",  async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN], true);
        let repositories = await getAllRepositories();
        let repos = await mapRepositoryListToRepositoryDtoList(repositories);
        let layout = getRepositoryLayout();
        res.send(await renderTablePageWithBasicLayout("Repositories" ,"Repositories", repos, layout, req, true, true));
    } catch (e) {
        console.log(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/my", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        let user = await findUserByToken(req.token);
        console.log(user.repositories);
        let repos = await mapRepositoryListToRepositoryDtoList(user.repositories);
        let layout = getRepositoryLayout();
        res.send(await renderTablePageWithBasicLayout("Repositories", "Repositories", repos, layout, req, true, true));
    } catch (e) {
        console.log(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/edit",  async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        const title = id ? "Edit Repository" : "Create Repository";
        let repoDto = new RepositoryDto(null, "", "", "", [], "", "", "");

        if(id) {
            const repository = (await findRepositoryById(id)).dataValues;
            const activeUser = (await getActiveUser(req.token)).dataValues;
            if (repository.userId !== activeUser.id && req.role !== roleEnum.SUPER_ADMIN) {
                throw new NotAuthorizedError("Unauthorized");
            }
            repoDto = await mapRepositoryToRepositoryDto(repository);
        }

        const values = repoDto.saveFiles.map(file => ({ key: file.id, value: file.name }));
        let userIdList = [];
        if(await checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN], false)) {
            userIdList = (await getAllUsers()).map(user => ({key: user.id, value: user.email}));
        }

        const layout = getRepositoryLayout(!id, values, userIdList);
        res.send(await renderPageObjectCreateEditPage("createEditRepository", title, repoDto, layout, req));
    } catch (e) {
        console.log(e);
        if(e.name === "NotFoundError") {
            return res.send(await renderPageFromHtmlFile("Backend/views/", "500", req));
        }
        if(e.name === "UnauthorizedError") {
            return res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
        }
        return res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/open",  async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        const repository = (await findRepositoryById(id)).dataValues;
        const activeUser = (await getActiveUser(req.token)).dataValues;
        if ((repository && repository.userId !== activeUser.id) && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }
        if(!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }
        res.send(await renderIdePageWithBasicLayout(repository.name, repository.name, repository, req));
    } catch (e) {
        console.log(e);
        if(e.name === "NotFoundError") {
            return res.send(await renderPageFromHtmlFile("Backend/views/", "500", req));
        }
        if(e.name === "UnauthorizedError") {
            return res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
        }
        return res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.post("/edit",  async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        let repository;
        if(id) {
            repository = (await findRepositoryById(id)).dataValues;
        }
        const name = req.body.name;
        const description = req.body.description;
        const entryPointFile = req.body.entryPointFile;
        const runtimeFile = req.body.runtimeFile;
        const runtimeImportFile = req.body.runtimeImportFile;
        let userId = (await getActiveUser(req.token)).id;

        if(await checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN], false)) {
            userId = req.body.userId;
        }

        if (repository && repository.userId !== userId && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if(!repository) {
            await createRepository(name, description, userId);
        }else {
            repository.name = name;
            repository.description = description;
            repository.entryPointFile = entryPointFile;
            repository.runtimeFile = runtimeFile;
            repository.runtimeImportFile = runtimeImportFile;
            repository.userId = userId;
            await updateRepository(repository);
        }

        res.send("Repository updated");
    } catch (e) {
        console.log(e);
        if(e.name === "NotFoundError") {
            return res.status(500).send("Repository not found");
        }
        if(e.name === "UnauthorizedError") {
            return res.status(401).send("Unauthorized");
        }
        return res.status(500).send("Internal server error");
    }
});

RepositoriesRouter.post("/save",  async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.repositoryId);
        const repository = (await findRepositoryById(id)).dataValues;
        const activeUser = (await getActiveUser(req.token)).dataValues;
        const newSaveFiles = req.body;

        if ((repository && repository.userId !== activeUser.id) && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if(!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }

        let oldSaveFiles = await getAllSaveFilesByRepositoryId(id);
        for (let i = 0; i < oldSaveFiles.length; i++) {
            let oldFile = oldSaveFiles[i];
            let newFile = newSaveFiles.find(file => file.id === oldFile.id);
            oldFile.content = newFile.content;
            updateSaveFile(oldFile);
        }

        res.send("Repository saved");
    } catch (e) {
        console.log(e);
        if(e.name === "NotFoundError") {
            return res.status(500).send("Repository not found");
        }
        if(e.name === "UnauthorizedError") {
            return res.status(401).send("Unauthorized");
        }
        return res.status(500).send("Internal server error");
    }
});

RepositoriesRouter.delete("/delete", (req, res) => {
    try {
        checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        let repository = getAllRepositories().find(repo => repo.id === id);
        if (repository && repository.userId !== getActiveUser(req.token).id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if(!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }

        deleteRepository(id);
        res.send("Repository deleted");
    } catch (e) {
        console.log(e);
        if(e.name === "NotFoundError") {
            return res.status(500).send("Repository not found");
        }
        if(e.name === "UnauthorizedError") {
            return res.status(401).send("Unauthorized");
        }
        return res.status(500).send("Internal server error");
    }
});

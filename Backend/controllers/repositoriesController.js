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
import {Repository} from "../models/repository.js";
import {
    createRepository,
    deleteRepository,
    getAllRepositories,
    updateRepository
} from "../repositories/repositoryRepository.js";
import {NotFoundError} from "../errors/notFoundError.js";
import {getAllSaveFiles, updateSaveFile} from "../repositories/saveFileRepository.js";

export const RepositoriesRouter = express.Router();
export const RepositoriesRoute = 'repositories';

RepositoriesRouter.get("/all", (req, res) => {
    try {
        checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN], true);
        let repositories = getAllRepositories();
        let repos = mapRepositoryListToRepositoryDtoList(repositories);
        let layout = getRepositoryLayout();
        res.send(renderTablePageWithBasicLayout("Repositories" ,"Repositories", repos, layout, req, true, true));
    } catch (e) {
        console.log(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/my", (req, res) => {
    try {
        checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        let user = getActiveUser(req.token, true);
        if (user.repositories.length === 0) {
            user.repositories = getAllRepositories().filter(repository => user.repositoryIds.includes(parseInt(repository.id)));
        }
        let repos = mapRepositoryListToRepositoryDtoList(user.repositories);
        let layout = getRepositoryLayout();
        res.send(renderTablePageWithBasicLayout("Repositories", "Repositories", repos, layout, req, true, true));
    } catch (e) {
        console.log(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/edit", (req, res) => {
    try {
        checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        const title = id ? "Edit Repository" : "Create Repository";
        let repository = getAllRepositories().find(repo => repo.id === id);

        if(!repository && id) {
            throw new NotFoundError("Repository not found with id: " + id);
        }

        if (repository && repository.userId !== getActiveUser(req.token).id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        let repoDto = mapRepositoryToRepositoryDto(repository);
        let layout = getRepositoryLayout(!id);
        res.send(renderPageObjectCreateEditPage("createEditRepository", title, repoDto, layout, req));
    } catch (e) {
        console.log(e);
        if(e.name === "NotFoundError") {
            return res.send(renderPageFromHtmlFile("Backend/views/", "500", req));
        }
        if(e.name === "UnauthorizedError") {
            return res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
        }
        return res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/open", (req, res) => {
    try {
        checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        const repository = getAllRepositories().find(repo => repo.id === id);
        if (repository && repository.userId !== getActiveUser(req.token).id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }
        if(!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }
        res.send(renderIdePageWithBasicLayout(repository.name, repository.name, repository, req));
    } catch (e) {
        console.log(e);
        if(e.name === "NotFoundError") {
            return res.send(renderPageFromHtmlFile("Backend/views/", "500", req));
        }
        if(e.name === "UnauthorizedError") {
            return res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
        }
        return res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.post("/edit", (req, res) => {
    try {
        checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.id);
        const repository = getAllRepositories().find(repo => repo.id === id);
        const name = req.body.name;
        const description = req.body.description;

        if (repository && repository.userId !== getActiveUser(req.token).id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if(!repository) {
            createRepository(name, description, getActiveUser(req.token).id);
        }else {
            updateRepository(repository);
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

RepositoriesRouter.post("/save", (req, res) => {
    try {
        checkIsAuthorizedWithRoles(req, [roleEnum.USER, roleEnum.ADMIN, roleEnum.SUPER_ADMIN], true);
        const id = parseInt(req.query.repositoryId);
        const repository = getAllRepositories().find(repo => repo.id === id);
        const newSaveFiles = req.body;

        if (repository && repository.userId !== getActiveUser(req.token).id && req.role !== roleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if(!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }
        console.log(newSaveFiles);
        console.log("---------------")

        let oldSaveFiles = getAllSaveFiles().filter(file => file.repositoryId === id);
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

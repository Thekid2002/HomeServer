import express from "express";
import {
    renderIdePageWithBasicLayout,
    renderPageFromHtmlFile,
    renderPageObjectCreateEditPage,
    renderTablePageWithBasicLayout
} from "../services/pageLayout";
import { checkIsAuthorizedWithRoles, getUserFromRequest } from "../services/authorizationService";
import { RoleEnum } from "../models/roleEnum";
import {
    mapRepositoryListToRepositoryDtoList,
    mapRepositoryToRepositoryDto
} from "../services/mapper";
import { getRepositoryLayout } from "../services/tableLayoutService";
import { NotAuthorizedError } from "../errors/notAuthorizedError";
import {
    createRepository,
    deleteRepository,
    findRepositoryById,
    getAllRepositories,
    updateRepository
} from "../repositories/repositoryRepository";
import { NotFoundError } from "../errors/notFoundError";
import {
    getAllSaveFilesByRepositoryId,
    updateSaveFile
} from "../repositories/saveFileRepository";
import { getAllUsers } from "../repositories/userRepository";
import { RepositoryDto } from "../dto/repositoryDto";
import { User } from "../models/user";
import { Repository } from "../models/repository";
import { SaveFile } from "../models/saveFile";
import { checkListItem, checkString } from "../services/checkService";
import { sequelize } from "../services/database";

export const RepositoriesRouter = express.Router();
export const RepositoriesRoute = "repositories";

RepositoriesRouter.get("/all", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ], true);
        const repositories = await getAllRepositories();
        const repos = await mapRepositoryListToRepositoryDtoList(repositories);
        const layout = getRepositoryLayout();
        res.send(
            await renderTablePageWithBasicLayout(
                "Repositories",
                "Repositories",
                repos,
                layout,
                req,
                true,
                true
            )
        );
    } catch (e) {
        console.log(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/my", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN ],
            true
        );
        const activeUser: User = await getUserFromRequest(req, true) as User;
        const repos = await mapRepositoryListToRepositoryDtoList(await activeUser.getRepositories());
        const layout = getRepositoryLayout();
        res.send(
            await renderTablePageWithBasicLayout(
                "Repositories",
                "Repositories",
                repos,
                layout,
                req,
                true,
                true
            )
        );
    } catch (e) {
        console.log(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/edit", async (req, res) => {
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
        const title = id ? "Edit Repository" : "Create Repository";
        let repoDto = new RepositoryDto(null, "", "", null, [], null, null, null);

        if (id) {
            const repository = await findRepositoryById(id, true) as Repository;
            const activeUser = await getUserFromRequest(req, true) as User;
            if (repository.userId !== activeUser.id && activeUser.role !== RoleEnum.SUPER_ADMIN) {
                throw new NotAuthorizedError("Unauthorized");
            }
            repoDto = await mapRepositoryToRepositoryDto(repository, await repository.getUser(), await repository.getSaveFiles());
        }

        const values: {key: number, value: string}[] = repoDto.saveFiles ? repoDto.saveFiles.map((file) => ({
            key: file.id,
            value: file.name
        })): [];

        let userIdList: {key: number, value: string}[] = [];
        if (await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ], false)) {
            userIdList = (await getAllUsers()).map((user) => ({
                key: user.id,
                value: user.email
            }));
        }

        const layout = getRepositoryLayout(!id, values, userIdList);
        res.send(
            await renderPageObjectCreateEditPage(
                "createEditRepository",
                title,
                repoDto,
                layout,
                req
            )
        );
    } catch (e: any) {
        console.log(e);
        if (e.name === "NotFoundError") {
            return res.send(
                await renderPageFromHtmlFile("Backend/views/", "500", req)
            );
        }
        if (e.name === "UnauthorizedError") {
            return res.send(
                await renderPageFromHtmlFile("Backend/views/", "401", req)
            );
        }
        return res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.get("/open", async (req, res) => {
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
        const repository = await findRepositoryById(id, true) as Repository;
        const activeUser = await getUserFromRequest(req, true) as User;
        if (
            repository &&
      repository.userId !== activeUser.id &&
      activeUser.role !== RoleEnum.SUPER_ADMIN
        ) {
            throw new NotAuthorizedError("Unauthorized");
        }
        if (!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }
        res.send(
            await renderIdePageWithBasicLayout(
                repository.name,
                repository.name,
                repository,
                req
            )
        );
    } catch (e: any) {
        console.log(e);
        if (e.name === "NotFoundError") {
            return res.send(
                await renderPageFromHtmlFile("Backend/views/", "500", req)
            );
        }
        if (e.name === "UnauthorizedError") {
            return res.send(
                await renderPageFromHtmlFile("Backend/views/", "401", req)
            );
        }
        return res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

RepositoriesRouter.post("/edit", async (req, res) => {
    const transaction = await sequelize.transaction();
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
        if (!id) {
            throw new Error("No id provided");
        }
        const repository: Repository = await findRepositoryById(id, false) as Repository;

        const name = checkString(req.body.name, false, 2, 256);
        const description = checkString(req.body.description, false, 0);
        const saveFileIds = (await repository!.getSaveFiles()).map(save => save.id);
        const bodyEntryPointFileId = parseInt(req.body.entryPointFile);
        const entryPointFileId = checkListItem(bodyEntryPointFileId, saveFileIds, false);
        const bodyRuntimeFileId = parseInt(req.body.runtimeFile);
        const runtimeFileId = checkListItem(bodyRuntimeFileId, saveFileIds, false);
        const bodyRuntimeImportFileId = parseInt(req.body.runtimeImportFile);
        const runtimeImportFileId = checkListItem(bodyRuntimeImportFileId, saveFileIds, false);

        if (!repository) {
            await createRepository(name, description, activeUser.id, transaction);
        } else {
            repository.name = name;
            repository.description = description;
            repository.entryPointFileId = entryPointFileId;
            repository.runtimeFileId = runtimeFileId;
            repository.runtimeImportFileId = runtimeImportFileId;
            await updateRepository(repository);
        }

        res.send("Repository updated");
    } catch (e: any) {
        console.log(e);
        if (e.name === "NotFoundError") {
            return res.status(500).send("Repository not found");
        }
        if (e.name === "UnauthorizedError") {
            return res.status(401).send("Unauthorized");
        }
        return res.status(500).send("Internal server error");
    }
});

RepositoriesRouter.post("/save", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN ],
            true
        );
        const queryId = req.query.repositoryId;
        if (!queryId || queryId !instanceof String) {
            throw new Error("No repository id provided");
        }
        const id = parseInt(queryId as string);
        const repository = await findRepositoryById(id, true) as Repository;
        const activeUser = await getUserFromRequest(req, true) as User;

        if (
            repository &&
      repository.userId !== activeUser.id &&
        activeUser.role !== RoleEnum.SUPER_ADMIN
        ) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if (!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }

        const oldSaveFiles: SaveFile[] = await getAllSaveFilesByRepositoryId(id);
        for (let i = 0; i < oldSaveFiles.length; i++) {
            const oldFile = oldSaveFiles[i];
            updateSaveFile(oldFile);
        }

        res.send("Repository saved");
    } catch (e: any) {
        console.log(e);
        if (e.name === "NotFoundError") {
            return res.status(500).send("Repository not found");
        }
        if (e.name === "UnauthorizedError") {
            return res.status(401).send("Unauthorized");
        }
        return res.status(500).send("Internal server error");
    }
});

RepositoriesRouter.delete("/delete", async (req, res) => {
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
        const repository = await findRepositoryById(id, true) as Repository;
        const activeUser = await getUserFromRequest(req, true) as User;

        if (
            repository &&
      repository.userId !== activeUser.id &&
      activeUser.role !== RoleEnum.SUPER_ADMIN
        ) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if (!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }

        await deleteRepository(id);
        res.send("Repository deleted");
    } catch (e: any) {
        console.log(e);
        if (e.name === "NotFoundError") {
            return res.status(500).send("Repository not found");
        }
        if (e.name === "UnauthorizedError") {
            return res.status(401).send("Unauthorized");
        }
        return res.status(500).send("Internal server error");
    }
});

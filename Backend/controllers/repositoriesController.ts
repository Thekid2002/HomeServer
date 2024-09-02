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
import {getRepositoryLayout} from "../services/tableLayoutService";
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
    getAllSaveFiles,
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
import {ValidationError} from "../errors/validationError";

export const RepositoriesRouter = express.Router();
export const RepositoriesRoute = "repositories";

RepositoriesRouter.get("/all", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ], true);
        const repositories = await getAllRepositories();
        const repos = await mapRepositoryListToRepositoryDtoList(repositories);
        const saveFileMap = (await getAllSaveFiles()).map(saveFile => ({ key: saveFile.id, value: saveFile.path }));
        const userMap = (await getAllUsers()).map(user => ({ key: user.id, value: user.email }));
        const layout = getRepositoryLayout(false, saveFileMap, userMap);
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
        const saveFileMap = (await getAllSaveFiles()).map(saveFile => ({ key: saveFile.id, value: saveFile.path }));
        const userMap = (await getAllUsers()).map(user => ({ key: user.id, value: user.email }));
        const layout = getRepositoryLayout(false, saveFileMap, userMap);
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
        if (!id) {
            throw new Error("No valid id provided");
        }

        const repository = await findRepositoryById(id, true) as Repository;
        const activeUser = await getUserFromRequest(req, true) as User;

        if (repository.userId !== activeUser.id && activeUser.role !== RoleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        const repoDto = await mapRepositoryToRepositoryDto(repository, await repository.getUser(), (await repository.getSaveFiles()).sort((a, b) => a.id - b.id));

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
                "Edit Repository",
                repoDto,
                layout,
                req,
                false
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

RepositoriesRouter.get("/create", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN ],
            true
        );

        let userIdList: {key: number, value: string}[] = [];
        if (await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ], false)) {
            userIdList = (await getAllUsers()).map((user) => ({
                key: user.id,
                value: user.email
            }));
        }

        const layout = getRepositoryLayout(true, [], userIdList);
        res.send(
            await renderPageObjectCreateEditPage(
                "createEditRepository",
                "Create Repository",
                null,
                layout,
                req,
                true
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
        const queryId = req.query.id;
        if (!queryId || queryId !instanceof String) {
            throw new Error("No id provided");
        }
        const id = parseInt(queryId as string);
        if (!id) {
            throw new Error("No id provided");
        }
        const activeUser = await getUserFromRequest(req, true) as User;
        const repository: Repository = await findRepositoryById(id, true) as Repository;

        if (repository.userId !== activeUser.id && activeUser.role !== RoleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        const { name, description, entryPointFileId, runtimeFileId, runtimeImportFileId, icon } = req.body;
        const saveFileIds = (await repository.getSaveFiles()).map(save => save.id);

        repository.name = checkString("Name", name, false, 2, 256);
        repository.description = checkString("Description", description, false, 0);
        repository.entryPointFileId = checkListItem(parseInt(entryPointFileId), saveFileIds, true);
        repository.runtimeFileId = checkListItem(parseInt(runtimeFileId), saveFileIds, true);
        repository.runtimeImportFileId = checkListItem(parseInt(runtimeImportFileId), saveFileIds, true);
        repository.icon = checkString("Icon", icon,true, 0, 256);

        await updateRepository(repository, transaction);

        await transaction.commit();
        res.send("Repository updated");
    } catch (e: any) {
        await transaction.rollback();
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

RepositoriesRouter.post("/create", async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN ],
            true
        );
        const activeUser = await getUserFromRequest(req, true) as User;

        const name = checkString("Name", req.body.name, false, 2, 256);
        const description = checkString("Description", req.body.description, false, 0);
        const icon = checkString("Icon", req.body.icon,true, 0, 256);

        await createRepository(name, description, activeUser.id, icon, transaction);

        await transaction.commit();
        res.send("Repository created");
    } catch (e: any) {
        await transaction.rollback();
        console.log(e);
        if (e instanceof NotFoundError) {
            return res.status(500).send("Repository not found");
        }
        if (e instanceof NotAuthorizedError) {
            return res.status(401).send("Unauthorized");
        }
        if(e instanceof ValidationError) {
            return res.status(400).send(e.message);
        }

        return res.status(500).send("Internal server error");
    }
});

RepositoriesRouter.post("/save", async (req, res) => {
    const transaction = await sequelize.transaction();
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

        if (repository && repository.userId !== activeUser.id && activeUser.role !== RoleEnum.SUPER_ADMIN) {
            throw new NotAuthorizedError("Unauthorized");
        }

        if (!repository) {
            throw new NotFoundError("Repository not found with id: " + id);
        }

        const oldSaveFiles: SaveFile[] = await getAllSaveFilesByRepositoryId(id);
        const newSaveFiles: {id: number, content: string}[] = req.body as {id: number, content: string}[];
        for (const newFile of newSaveFiles) {
            const oldFile: SaveFile | undefined = oldSaveFiles.find(old => old.id === newFile.id);
            if (oldFile) {
                oldFile.content = newFile.content;
                await updateSaveFile(oldFile, transaction);
            }
        }

        await transaction.commit();
        res.send("Repository saved");
    } catch (e: any) {
        await transaction.rollback();
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

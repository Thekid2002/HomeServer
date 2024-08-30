import { log } from "../services/logger";
import { Transaction } from "sequelize";
import { SaveFile } from "../models/saveFile";
import { Repository } from "../models/repository";
import { User } from "../models/user";

// Create a save file
export async function createSaveFile(
    name: string,
    path: string,
    content: string,
    repositoryId: number,
    transaction: Transaction
): Promise<SaveFile> {
    const saveFile = await SaveFile.create(
        {
            name,
            path,
            content,
            repositoryId
        },
        { transaction }
    );

    return saveFile;
}

// Get all save files
export async function getAllSaveFiles(includeRepository = false, includeUsers = false): Promise<SaveFile[]> {
    log("Getting all save files");

    const repositoryInclude = includeRepository ? [
        {
            model: Repository,
            as: "repository"
        }
    ]
        : [];

    const userInclude = includeUsers ? [
        {
            model: User,
            as: "user"
        }
    ]
        : [];

    const includes = [ ...repositoryInclude, ...userInclude ];

    // Fetch save files with associated repositories
    const saveFiles = await SaveFile.findAll({
        include: includes
    });

    return saveFiles;
}

export async function findSaveFileById(id: number, throwIfNotFound = true): Promise<SaveFile | null> {
    log("Finding save file by id: " + id);

    const saveFile = await SaveFile.findByPk(id);

    if (!saveFile && throwIfNotFound) {
        throw new Error("Save file not found with id: " + id);
    }

    return saveFile;
}

export async function getAllSaveFilesByRepositoryId(repositoryId: number, includeRepository = false): Promise<SaveFile[]> {
    log("Getting all save files by repository id: " + repositoryId);

    const repositoryInclude = includeRepository ? [
        {
            model: Repository,
            as: "repository"
        }
    ]: [];

    // Fetch save files with associated repositories
    const saveFiles = await SaveFile.findAll({
        where: {
            repositoryId
        },
        include: repositoryInclude
    });

    return saveFiles;
}

// Update a save file
export async function updateSaveFile(saveFile: SaveFile): Promise<SaveFile> {
    const oldSaveFile = await SaveFile.findByPk(saveFile.id);
    if (!oldSaveFile) {
        throw new Error("Save file not found with id: " + saveFile.id);
    }

    await oldSaveFile.update({
        name: saveFile.name,
        path: saveFile.path,
        content: saveFile.content
    });

    return oldSaveFile;
}

// Delete a save file
export async function deleteSaveFile(id: number): Promise<void> {
    try {
        const saveFile = await SaveFile.findByPk(id);
        if (!saveFile) {
            throw new Error("Save file not found with id: " + id);
        }

        await saveFile.destroy();
    } catch (error) {
        console.error("Error deleting save file:", error);
        throw error;
    }
}

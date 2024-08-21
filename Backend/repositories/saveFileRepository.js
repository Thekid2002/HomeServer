
import { log } from "../services/logger.js";
import {Repository, SaveFile} from "../services/database.js";

// Create a save file
export async function createSaveFile(name, path, content, repositoryId, transaction) {
    const saveFile = await SaveFile.create({
        name,
        path,
        content,
        repositoryId
    }, { transaction });

    return saveFile;
}

// Get all save files
export async function getAllSaveFiles() {
    log("Getting all save files");

    // Fetch save files with associated repositories
    const saveFiles = await SaveFile.findAll({
        include: [{
            model: Repository,
            as: 'repository'
        }]
    });

    return saveFiles;
}

export async function findSaveFileById(id) {
    log("Finding save file by id: " + id);

    const saveFile = await SaveFile.findByPk(id);

    return saveFile;
}

export async function getAllSaveFilesByRepositoryId(repositoryId) {
    log("Getting all save files by repository id: " + repositoryId);

    // Fetch save files with associated repositories
    const saveFiles = await SaveFile.findAll({
        where: {
            repositoryId
        },
        include: [{
            model: Repository,
            as: 'repository'
        }]
    });

    return saveFiles;
}

// Update a save file
export async function updateSaveFile(saveFile) {
    const oldSaveFile = await SaveFile.findByPk(saveFile.id);
    if (!oldSaveFile) {
        throw new Error("Save file not found with id: " + saveFile.id);
    }

    await oldSaveFile.update({
        name: saveFile.name,
        path: saveFile.path,
        content: saveFile.content,
    });

    return oldSaveFile;
}

// Delete a save file
export async function deleteSaveFile(id) {
    try {
        const saveFile = await SaveFile.findByPk(id);
        if (!saveFile) {
            throw new Error("Save file not found with id: " + id);
        }

        await saveFile.destroy();
    } catch (error) {
        console.error('Error deleting save file:', error);
        throw error;
    }
}

import {SaveFile} from "../models/saveFile.js";
import fs from "fs";
import {getAllRepositories} from "./repositoryRepository.js";

let savePath = 'Backend/data/saveFiles.json';

let saveFiles = [];

export function getAllSaveFiles() {
    if(saveFiles.length !== 0){
        return saveFiles;
    }
    createFileIfDoesNotExist();
    saveFiles = JSON.parse(fs.readFileSync(savePath, 'utf8'));
    if(saveFiles.length === 0){
        return [];
    }
    for (let saveFile of saveFiles){
        saveFile.repository = getAllRepositories().find(repository => repository.id === saveFile.repositoryId);
    }
    return saveFiles;
}


function getNextId() {
    let saveFiles = getAllSaveFiles();
    if(saveFiles.length === 0){
        return 1;
    }
    return saveFiles[saveFiles.length-1].id+1;
}

function saveAllSaveFiles() {
    let saveSaveFiles = [];
    for(let saveFile of saveFiles){
        let saveSaveFile = { ...saveFile };
        saveSaveFile.repository = null;
        saveSaveFiles.push(saveSaveFile);
    }
    fs.writeFileSync(savePath, JSON.stringify(saveSaveFiles));
    saveFiles = [];
}

export function updateSaveFile(saveFile) {
    let index = getAllSaveFiles().findIndex(s => s.id === saveFile.id);
    if(index === -1){
        throw new Error("Save file not found");
    }
    saveFiles[index] = saveFile;
    saveAllSaveFiles();
}

export function deleteSaveFile(id) {
    let index = getAllSaveFiles().findIndex(s => s.id === id);
    if(index === -1){
        throw new Error("Save file not found");
    }
    saveFiles.splice(index, 1);
    saveAllSaveFiles();
}

/**
 * Create a save file
 * @param name the name of the save file
 * @param path the path of the save file
 * @param content the content of the save file
 * @param repositoryId the id of the repository the save file belongs to
 * @returns {SaveFile}
 */
export function createSaveFile(name, path, content, repositoryId) {
    const id = getNextId();
    let saveFile = new SaveFile(id, name, path, repositoryId, content);
    getAllSaveFiles();
    saveFiles.push(saveFile);
    saveAllSaveFiles();
    return saveFile;
}

/**
 * Create the save file if it does not exist
 */
function createFileIfDoesNotExist() {
    const dir = savePath.substring(0, savePath.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(savePath)) {
        fs.writeFileSync(savePath, '[]');
    }
}
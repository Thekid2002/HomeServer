import fs from "fs";
import {createSaveFile, deleteSaveFile, getAllSaveFiles} from "./saveFileRepository.js";
import {Repository} from "../models/repository.js";
import {log} from "../services/logger.js";
import {addRepositoryToUser, getAllUsers} from "./userRepository.js";

const savePath = 'Backend/data/repositories.json';

let repositories = [];

/**
 * Updates a repository
 * @param repository
 */
export function updateRepository(repository){
    let index = repositories.findIndex(repo => repo.id === repository.id);
    if(index === -1){
        throw new Error("Repository not found with id: " + repository.id);
    }
    repositories[index] = repository;
    saveAllRepositories();
}

export function deleteRepository(repositoryId){
    let index = getAllRepositories().findIndex(repo => repo.id === repositoryId);
    if(index === -1){
        throw new Error("Repository not found with id: " + repositoryId);
    }
    for (let saveFile of getAllSaveFiles().filter(saveFile => saveFile.repositoryId === repositoryId)){
        deleteSaveFile(saveFile.id);
    }
    repositories.splice(index, 1);
    saveAllRepositories();
}

/**
 * Create a repository with a name and a description
 * @param name the name of the repository
 * @param description the description of the repository
 * @param userId the id of the user who owns the repository
 * @returns {Repository}
 */
export function createRepository(name, description, userId) {
    const id = getNextId();
    const defaultCarlSaveFile = getDefaultCarlSaveFile(id);
    const defaultCarlRuntimeFile = getDefaultCarlRuntimeFile(id);
    const defaultCarlImportObjectFile = getDefaultCarlImportObjectFile(id);
    const user = getAllUsers().find(user => user.id === userId);
    let repository = new Repository(id, name, description, userId, defaultCarlSaveFile, defaultCarlRuntimeFile, defaultCarlImportObjectFile);
    getAllRepositories()
    repositories.push(repository);
    saveAllRepositories();
    addRepositoryToUser(user, repository);
    return repository;
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

/**
 * Get all repositories
 * @returns {Repository[] | []}
 */
export function getAllRepositories() {
    log("Getting all repositories");
    if(repositories.length !== 0){
        return repositories;
    }
    createFileIfDoesNotExist();
    repositories = JSON.parse(fs.readFileSync(savePath, 'utf8'));
    if(repositories.length === 0){
        return [];
    }
    for (let repository of repositories){
        let userIdInt = parseInt(repository.userId);
        repository.user = getAllUsers().find(user => user.id === userIdInt);
        if(!repository.user){
            throw new Error("User not found for repository with id: " + repository.id);
        }
        repository.saveFiles = getAllSaveFiles().filter(saveFile => saveFile.repositoryId === repository.id);
    }
    return repositories;
}

/**
 * Save all repositories
 */
export function saveAllRepositories() {
    let saveRepositories = [];
    for(let repository of repositories){
        let saveRepository = { ...repository };
        saveRepository.saveFiles = [];
        saveRepository.user = null;
        saveRepositories.push(saveRepository);
    }
    fs.writeFileSync(savePath, JSON.stringify(saveRepositories));
    repositories = [];
}

/**
 * Get the next id for a repository
 * @returns {number}
 */
function getNextId() {
    let repositories = getAllRepositories();
    if(repositories.length === 0){
        return 1;
    }
    return repositories[repositories.length-1].id+1;
}


function getDefaultCarlSaveFile(repositoryId){
    return createSaveFile("main",
        "main.carl",
        "import \"console\" \"print\" void print(string value);\n" + "import \"js\" \"toStringInt\" string toStringInt(int value);\n" +
        "import \"js\" \"toStringBool\" string toStringBool(bool value);\n" + "import \"js\" \"toStringDouble\" string toStringDouble(double value);\n" +
        "import \"js\" \"concat\" string concat(string str1, string str2);\n" + "\n" + "export void _start() {\n" +
        "  print(\"Hello world!\");\n" + "}",
    repositoryId);
}

function getDefaultCarlRuntimeFile(repositoryId) {
    return createSaveFile("carlRuntime",
        "carlRuntime.js",
        "// Create a new WebAssembly.Memory object\n" +
        "let memory = new WebAssembly.Memory({ initial: 1 });\n" +
        "\n" +
        "// Compile the WebAssembly module\n" +
        "await WebAssembly.compile(output).then(async module => {\n" +
        "    const importObject = getImportObjectFromImportObjectFile();\n" +
        "    const wasmInstance = new WebAssembly.Instance(module, importObject);\n" +
        "    const {_start, fib, stackPointer} = wasmInstance.exports;\n" +
        "    _start();\n" +
        "});"
        ,repositoryId)
}

function getDefaultCarlImportObjectFile(repositoryId) {
    return createSaveFile("carlRuntimeImport",
        "carlRuntimeImport.json",
        "{\n" +
        "    js: {\n" +
        "        memory,\n" +
        "        concat: (offset1, offset2) => {\n" +
        "            const buffer = new Uint8Array(memory.buffer);\n" +
        "            let stackPointer = wasmInstance.exports.stackPointer.value;\n" +
        "\n" +
        "            let i = 0;\n" +
        "            let string1 = \"\";\n" +
        "            while (buffer[offset1 + i] !== 0) {\n" +
        "                string1 += String.fromCharCode(buffer[offset1 + i]);\n" +
        "                i++;\n" +
        "            }\n" +
        "\n" +
        "            i = 0;\n" +
        "            let string2 = \"\";\n" +
        "            while (buffer[offset2 + i] !== 0) {\n" +
        "                string2 += String.fromCharCode(buffer[offset2 + i]);\n" +
        "                i++;\n" +
        "            }\n" +
        "\n" +
        "            let str = string1 + string2 + '\\0';\n" +
        "\n" +
        "            for (let i = 0; i < str.length; i++) {\n" +
        "                buffer[stackPointer + i] = str.charCodeAt(i);\n" +
        "            }\n" +
        "            wasmInstance.exports.stackPointer.value += str.length;\n" +
        "            return stackPointer;\n" +
        "        },\n" +
        "        toStringInt: (value) => {\n" +
        "            const buffer = new Uint8Array(memory.buffer);\n" +
        "            let stackPointer = wasmInstance.exports.stackPointer.value;\n" +
        "            const str = value.toString() + '\\0';\n" +
        "\n" +
        "            for (let i = 0; i < str.length; i++) {\n" +
        "                buffer[stackPointer + i] = str.charCodeAt(i);\n" +
        "            }\n" +
        "            wasmInstance.exports.stackPointer.value += str.length;\n" +
        "            return stackPointer;\n" +
        "        },\n" +
        "        toStringDouble: (value) => {\n" +
        "            const buffer = new Uint8Array(memory.buffer);\n" +
        "            let stackPointer = wasmInstance.exports.stackPointer.value;\n" +
        "            const str = value.toString() + '\\0';\n" +
        "\n" +
        "            for (let i = 0; i < str.length; i++) {\n" +
        "                buffer[stackPointer + i] = str.charCodeAt(i);\n" +
        "            }\n" +
        "            wasmInstance.exports.stackPointer.value += str.length;\n" +
        "            return stackPointer;\n" +
        "        },\n" +
        "        toStringBool: (value) => {\n" +
        "            const buffer = new Uint8Array(memory.buffer);\n" +
        "            let stackPointer = wasmInstance.exports.stackPointer.value;\n" +
        "            const str = value ? \"true\\0\" : \"false\\0\";\n" +
        "\n" +
        "            for (let i = 0; i < str.length; i++) {\n" +
        "                buffer[stackPointer + i] = str.charCodeAt(i);\n" +
        "            }\n" +
        "            wasmInstance.exports.stackPointer.value += str.length;\n" +
        "            return stackPointer;\n" +
        "        },\n" +
        "        scanDouble: (offset) => {\n" +
        "            return parseFloat(prompt(logMemory(memory.buffer, offset)));\n" +
        "        },\n" +
        "        scanInt: (offset) => {\n" +
        "            let value = prompt(logMemory(memory.buffer, offset));\n" +
        "            if (value == null) {\n" +
        "                return 0;\n" +
        "            }\n" +
        "            return parseInt(value)\n" +
        "        },\n" +
        "        scanBool: (offset) => {\n" +
        "            let value = prompt(logMemory(memory.buffer, offset));\n" +
        "            if (value == null) {\n" +
        "                return 0;\n" +
        "            }\n" +
        "            if (value.toLowerCase() === \"true\") {\n" +
        "                return 1;\n" +
        "            }\n" +
        "            if (value.toLowerCase() === \"false\") {\n" +
        "                return 0;\n" +
        "            }\n" +
        "            return parseInt(value);\n" +
        "        },\n" +
        "        scanString: (offset) => {\n" +
        "            let value = prompt(logMemory(memory.buffer, offset)) + '\\0';\n" +
        "            if (value == null) {\n" +
        "                return 0;\n" +
        "            }\n" +
        "            const buffer = new Uint8Array(memory.buffer);\n" +
        "            let stackPointer = wasmInstance.exports.stackPointer.value;\n" +
        "\n" +
        "            for (let i = 0; i < value.length; i++) {\n" +
        "                buffer[stackPointer + i] = value.charCodeAt(i);\n" +
        "            }\n" +
        "\n" +
        "            wasmInstance.exports.stackPointer.value += value.length;\n" +
        "            return stackPointer;\n" +
        "        }\n" +
        "    },\n" +
        "    console: {\n" +
        "        print: (offset) => {\n" +
        "            console.log(logMemory(memory.buffer, offset));\n" +
        "        }\n" +
        "    }\n" +
        "}",
         repositoryId)
}

import { log } from "../services/logger.js";
import {createSaveFile} from "./saveFileRepository.js";
import {Repository, SaveFile, User} from "../services/database.js";

// Create a repository with a name and a description
export async function createRepository(name, description, userId, transaction) {
    // Create the repository in the database
    const repository = await Repository.create({
        name,
        description,
        userId,
    }, {transaction});

    await createDefaultSaveFiles(repository.id, transaction);

    return repository;
}

/**
 * Find a repository by id
 * @param repositoryId the id of the repository
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
export async function findRepositoryById(repositoryId) {
    if(!repositoryId) {
        throw new Error("Repository id is required");
    }

    const repository = await Repository.findByPk(repositoryId, {
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: SaveFile,
                as: 'saveFiles'
            }
        ]
    });

    return repository;
}

// Update a repository
export async function updateRepository(repository) {
    const existingRepository = await Repository.findByPk(repository.id);
    if (!existingRepository) {
        throw new Error("Repository not found with id: " + repository.id);
    }

    // Perform the update
    await existingRepository.update({
        name: repository.name,
        description: repository.description,
        entryPointFile: repository.entryPointFile,
        runtimeFile: repository.runtimeFile,
        runtimeImportFile: repository.runtimeImportFile
    });


    console.log(`Repository with id:"${repository.id}" updated successfully.`);
    return existingRepository;
}

// Delete a repository
export async function deleteRepository(repositoryId) {
    try {
        // Find the repository and delete related save files
        const repository = await Repository.findByPk(repositoryId);
        if (!repository) {
            throw new Error("Repository not found with id: " + repositoryId);
        }

        // Delete related save files
        await SaveFile.destroy({
            where: { repositoryId }
        });

        // Delete the repository
        await repository.destroy();
    } catch (error) {
        console.error('Error deleting repository:', error);
        throw error;
    }
}

// Get all repositories
export async function getAllRepositories() {
    try {
        log("Getting all repositories");

        // Fetch repositories with associated users and save files
        const repositories = await Repository.findAll({
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: SaveFile,
                    as: 'saveFiles'
                }
            ]
        });

        return repositories;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

export async function getAllRepositoriesByUserId(userId) {
    try {
        log("Getting all repositories by user id: " + userId);

        if(!userId) {
            throw new Error("User id is required");
        }

        // Fetch repositories with associated users and save files
        const repositories = await Repository.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: SaveFile,
                    as: 'saveFiles'
                }
            ]
        });

        return repositories;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

export async  function createDefaultSaveFiles(repositoryId, transaction) {
    // Create default save files
    const defaultCarlSaveFile = await createSaveFile("main",
        "main.carl",
        `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "toStringDouble" string toStringDouble(double value);
import "js" "concat" string concat(string str1, string str2);

export void _start() {
    print("Hello world!");
}`,
        repositoryId, transaction);

    const defaultCarlRuntimeFile = await createSaveFile("carlRuntime",
        "carlRuntime.js",
        `// Create a new WebAssembly.Memory object
let memory = new WebAssembly.Memory({ initial: 1 });

// Compile the WebAssembly module
await WebAssembly.compile(output).then(async module => {
    const importObject = getImportObjectFromImportObjectFile();
    const wasmInstance = new WebAssembly.Instance(module, importObject);
    const {_start, fib, stackPointer} = wasmInstance.exports;
    _start();
});`,
        repositoryId, transaction);

    const defaultCarlImportObjectFile = await createSaveFile("carlRuntimeImport",
        "carlRuntimeImport.json",
        `{
js: {
    memory,
    concat: (offset1, offset2) => {
        const buffer = new Uint8Array(memory.buffer);
        let stackPointer = wasmInstance.exports.stackPointer.value;
        let i = 0;
        let string1 = "";
        while (buffer[offset1 + i] !== 0) {
            string1 += String.fromCharCode(buffer[offset1 + i]);
            i++;
        }
        i = 0;
        let string2 = "";
        while (buffer[offset2 + i] !== 0) {
            string2 += String.fromCharCode(buffer[offset2 + i]);
            i++;
        }
        let str = string1 + string2 + '\\0';
        for (let i = 0; i < str.length; i++) {
            buffer[stackPointer + i] = str.charCodeAt(i);
        }
        wasmInstance.exports.stackPointer.value += str.length;
        return stackPointer;
    },
    toStringInt: (value) => {
        const buffer = new Uint8Array(memory.buffer);
        let stackPointer = wasmInstance.exports.stackPointer.value;
        const str = value.toString() + '\\0';
        for (let i = 0; i < str.length; i++) {
            buffer[stackPointer + i] = str.charCodeAt(i);
        }
        wasmInstance.exports.stackPointer.value += str.length;
        return stackPointer;
    },
    toStringDouble: (value) => {
        const buffer = new Uint8Array(memory.buffer);
        let stackPointer = wasmInstance.exports.stackPointer.value;
        const str = value.toString() + '\\0';
        for (let i = 0; i < str.length; i++) {
            buffer[stackPointer + i] = str.charCodeAt(i);
        }
        wasmInstance.exports.stackPointer.value += str.length;
        return stackPointer;
    },
    toStringBool: (value) => {
        const buffer = new Uint8Array(memory.buffer);
        let stackPointer = wasmInstance.exports.stackPointer.value;
        const str = value ? "true\\0" : "false\\0";
        for (let i = 0; i < str.length; i++) {
            buffer[stackPointer + i] = str.charCodeAt(i);
        }
        wasmInstance.exports.stackPointer.value += str.length;
        return stackPointer;
    },
    scanDouble: (offset) => {
        return parseFloat(prompt(logMemory(memory.buffer, offset)));
    },
    scanInt: (offset) => {
        let value = prompt(logMemory(memory.buffer, offset));
        if (value == null) {
            return 0;
        }
        return parseInt(value);
    },
    scanBool: (offset) => {
        let value = prompt(logMemory(memory.buffer, offset));
        if (value == null) {
            return 0;
        }
        if (value.toLowerCase() === "true") {
            return 1;
        }
        if (value.toLowerCase() === "false") {
            return 0;
        }
        return parseInt(value);
    },
    scanString: (offset) => {
        let value = prompt(logMemory(memory.buffer, offset)) + '\\0';
        if (value == null) {
            return 0;
        }
        const buffer = new Uint8Array(memory.buffer);
        let stackPointer = wasmInstance.exports.stackPointer.value;
        for (let i = 0; i < value.length; i++) {
            buffer[stackPointer + i] = value.charCodeAt(i);
        }
        wasmInstance.exports.stackPointer.value += value.length;
        return stackPointer;
    }
},
console: {
    print: (offset) => {
        console.log(logMemory(memory.buffer, offset));
    }
}
}`,
        repositoryId, transaction);

    return [defaultCarlSaveFile, defaultCarlRuntimeFile, defaultCarlImportObjectFile];
}
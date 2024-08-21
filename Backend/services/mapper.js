import {UserDto} from "../dto/userDto.js";
import {RepositoryDto} from "../dto/repositoryDto.js";
import {SaveFileDto} from "../dto/saveFileDto.js";
import {findRepositoryById} from "../repositories/repositoryRepository.js";

/**
 * Map a user to a user DTO
 * @param user
 * @returns {Promise<UserDto>} the user DTO
 */
export async function mapUserToUserDto(user) {
    if (!user) {
        return new UserDto(null, "", "", "", "", 0, "");
    }
    return new UserDto(user.id, user.firstname, user.surname, user.phone, user.email, user.role, mapDateTimeToIsoString(user.signupDateTime));
}

/**
 * Map a list of users to a list of user DTOs
 * @param users the list of users
 * @returns {Promise<UserDto[]>} the list of user DTOs
 */
export async function mapUserListToUserDtoList(users) {
    if (users.length === 0) {
        return [];
    }
    for (let i = 0; i < users.length; i++) {
        users[i] = await mapUserToUserDto(users[i].dataValues);
    }
    return users;
}

/**
 * Map a save file to a save file DTO
 * @param saveFile the save file
 * @returns {Promise<SaveFileDto>} the save file DTO
 */
async function mapSaveFileToSaveFileDto(saveFile) {
    saveFile.repository = await findRepositoryById(saveFile.repositoryId)
    let repoValues = saveFile.repository.dataValues;
    return new SaveFileDto(saveFile.id, saveFile.name, saveFile.path, saveFile.content, saveFile.repository, repoValues.entryPointFile === saveFile.id, repoValues.runtimeFile === saveFile.id, repoValues.runtimeImportFile === saveFile.id);
}

/**
 * Map a list of save files to a list of save file DTOs
 * @param saveFiles the list of save files
 * @returns {Promise<SaveFileDto[]>} the list of save file DTOs
 */
export async function mapSaveFilesToSaveFileDtoList(saveFiles) {
    if(!saveFiles) {
        return [];
    }
    if (saveFiles.length === 0) {
        return [];
    }
    for (let i = 0; i < saveFiles.length; i++) {
        saveFiles[i] = await mapSaveFileToSaveFileDto(saveFiles[i].dataValues);
    }
    return saveFiles;
}

/**
 * Map a repository to a repository DTO
 * @param repository the repository
 * @returns {Promise<RepositoryDto>} the repository DTO
 */
export async function mapRepositoryToRepositoryDto(repository) {
    if(!repository) {
        return new RepositoryDto(null, "", "", "", [], "", "", "");
    }
    let saveFiles = await mapSaveFilesToSaveFileDtoList(repository.saveFiles);
    return new RepositoryDto(repository.id, repository.name, repository.description, repository.user, saveFiles, repository.entryPointFile, repository.runtimeFile, repository.runtimeImportFile);
}

/**
 * Map a list of repositories to a list of repository DTOs
 * @param repositories the list of repositories
 * @returns {Promise<RepositoryDto[]>} the list of repository DTOs
 */
export async function mapRepositoryListToRepositoryDtoList(repositories) {
    if(repositories.length === 0) {
        return [];
    }
    for (let i = 0; i < repositories.length; i++) {
        repositories[i] = await mapRepositoryToRepositoryDto(repositories[i].dataValues);
    }
    return repositories;
}

/**
 * Map a date time to an ISO string
 * @param dateTime the date time
 * @returns {string}
 */
export function mapDateTimeToIsoString(dateTime) {
    console.log(dateTime);
    if(!dateTime){
        return "";
    }
    let datePieces = new Date(dateTime).toISOString().split('T')
    let date = datePieces[0];
    let time = datePieces[1].split('.')[0];
    return date + ' ' + time;
}
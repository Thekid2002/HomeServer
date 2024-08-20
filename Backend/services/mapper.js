import {UserDto} from "../dto/userDto.js";
import {RepositoryDto} from "../dto/repositoryDto.js";
import {SaveFileDto} from "../dto/saveFileDto.js";
import {getAllRepositories} from "../repositories/repositoryRepository.js";

/**
 * Map a user to a user DTO
 * @param user
 * @returns {UserDto | null}
 */
export function mapUserToUserDto(user) {
    if (!user) {
        return new UserDto(null, "", "", "", "", 0, "");
    }
    return new UserDto(user.id, user.firstname, user.surname, user.phone, user.email, user.role, mapDateTimeToIsoString(user.signupDateTime));
}

/**
 * Map a list of users to a list of user DTOs
 * @param users the list of users
 * @returns {UserDto[]} the list of user DTOs
 */
export function mapUserListToUserDtoList(users) {
    return users.map(user => mapUserToUserDto(user));
}

/**
 * Map a save file to a save file DTO
 * @param saveFile the save file
 * @returns {SaveFileDto} the save file DTO
 */
function mapSaveFileToSaveFileDto(saveFile) {
    saveFile.repository = getAllRepositories().find(repository => repository.id === saveFile.repositoryId);
    return new SaveFileDto(saveFile.id, saveFile.name, saveFile.path, saveFile.content, saveFile.repository);
}

/**
 * Map a list of save files to a list of save file DTOs
 * @param saveFiles the list of save files
 * @returns {SaveFileDto[]} the list of save file DTOs
 */
export function mapSaveFilesToSaveFileDtoList(saveFiles) {
    if (saveFiles.length === 0) {
        return [];
    }
    return saveFiles.map(saveFile => mapSaveFileToSaveFileDto(saveFile));
}

/**
 * Map a repository to a repository DTO
 * @param repository the repository
 * @returns {RepositoryDto} the repository DTO
 */
export function mapRepositoryToRepositoryDto(repository) {
    if(!repository) {
        return new RepositoryDto(null, "", "", "", []);
    }
    let saveFiles = mapSaveFilesToSaveFileDtoList(repository.saveFiles);
    return new RepositoryDto(repository.id, repository.name, repository.description, repository.user, saveFiles);
}

/**
 * Map a list of repositories to a list of repository DTOs
 * @param repositories the list of repositories
 * @returns {RepositoryDto[]} the list of repository DTOs
 */
export function mapRepositoryListToRepositoryDtoList(repositories) {
    return repositories.map(repository => mapRepositoryToRepositoryDto(repository));
}

/**
 * Map a date time to an ISO string
 * @param dateTime the date time
 * @returns {string}
 */
export function mapDateTimeToIsoString(dateTime) {
    let datePieces = new Date(dateTime).toISOString().split('T')
    let date = datePieces[0];
    let time = datePieces[1].split('.')[0];
    return date + ' ' + time;
}
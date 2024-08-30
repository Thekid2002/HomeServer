import { UserDto } from "../dto/userDto";
import { RepositoryDto } from "../dto/repositoryDto";
import { SaveFileDto } from "../dto/saveFileDto";
import { SaveFile } from "../models/saveFile";
import { User } from "../models/user";
import { Repository } from "../models/repository";

/**
 * Map a user to a user DTO
 * @param user
 * @param includeRepository
 * @param includeSaveFiles
 */
export async function mapUserToUserDto(user: User, includeRepository = false, includeSaveFiles = false): Promise<UserDto> {
    if (includeSaveFiles && !includeRepository) {
        throw new Error("Cannot include save files without including repository");
    }

    return new UserDto(
        user.id,
        user.firstname,
        user.surname,
        user.phone,
        user.email,
        user.role,
        includeRepository ? await mapRepositoryListToRepositoryDtoList(await user.getRepositories()) : null,
        mapDateTimeToIsoString(new Date(user.signupDateTime))
    );
}

/**
 * Map a list of users to a list of user DTOs
 * @param users the list of users
 * @returns {Promise<UserDto[]>} the list of user DTOs
 */
export async function mapUserListToUserDtoList(users: User[]): Promise<UserDto[]> {
    if (users.length === 0) {
        return [];
    }
    const userDtos: UserDto[] = [];
    for (let i = 0; i < users.length; i++) {
        userDtos.push(await mapUserToUserDto(users[i]));
    }
    return userDtos;
}

/**
 * Map a save file to a save file DTO
 * @param saveFile the save file
 * @param repository the repository
 */
async function mapSaveFileToSaveFileDto(saveFile: SaveFile, repository: Repository): Promise<SaveFileDto> {
    return new SaveFileDto(
        saveFile.id,
        saveFile.name,
        saveFile.path,
        saveFile.content,
        repository,
        repository.entryPointFileId === saveFile.id,
        repository.runtimeFileId === saveFile.id,
        repository.runtimeImportFileId === saveFile.id
    );
}

/**
 * Map a list of save files to a list of save file DTOs
 * @param saveFiles the list of save files
 * @param repository the repository
 */
export async function mapSaveFilesToSaveFileDtoList(saveFiles: SaveFile[], repository: Repository): Promise<SaveFileDto[]> {
    if (!saveFiles) {
        return [];
    }
    if (saveFiles.length === 0) {
        return [];
    }
    const saveFileDtos: SaveFileDto[] = [];
    for (let i = 0; i < saveFiles.length; i++) {
        saveFileDtos.push(await mapSaveFileToSaveFileDto(saveFiles[i], repository));
    }
    return saveFileDtos;
}

/**
 * Map a repository to a repository DTO
 * @param repository the repository
 * @param user the user
 * @param saveFiles the save files
 */
export async function mapRepositoryToRepositoryDto(repository: Repository, user: User, saveFiles: SaveFile[]): Promise<RepositoryDto> {
    return new RepositoryDto(
        repository.id,
        repository.name,
        repository.description,
        user,
        await mapSaveFilesToSaveFileDtoList(saveFiles, repository),
        repository.entryPointFileId,
        repository.runtimeFileId,
        repository.runtimeImportFileId
    );
}

/**
 * Map a list of repositories to a list of repository DTOs
 * @param repositories the list of repositories
 * @param includeUser whether to include the user
 * @param includeSaveFiles whether to include the save files
 */
export async function mapRepositoryListToRepositoryDtoList(repositories: Repository[] ): Promise<RepositoryDto[]> {
    if (repositories.length === 0) {
        return [];
    }
    const repositoryDtos: RepositoryDto[] = [];
    for (let i = 0; i < repositories.length; i++) {
        repositoryDtos.push(await mapRepositoryToRepositoryDto(repositories[i], await repositories[i].getUser(), await repositories[i].getSaveFiles()));
    }
    return repositoryDtos;
}

/**
 * Map a date time to an ISO string
 * @param dateTime the date time
 * @returns {string}
 */
export function mapDateTimeToIsoString(dateTime: Date): string {
    console.log(dateTime);
    if (!dateTime) {
        return "";
    }
    const datePieces = new Date(dateTime).toISOString().split("T");
    const date = datePieces[0];
    const time = datePieces[1].split(".")[0];
    return date + " " + time;
}

import { SaveFileDto } from "./saveFileDto";
import { User } from "../models/user";

export class RepositoryDto {
    id: number | null;
    name: string;
    description: string;
    userName: string | null = null;
    userEmail: string | null = null;
    userId: number | null = null;
    saveFiles: SaveFileDto[] | null = null;
    link: string;
    entryPointFileId: number | null;
    runtimeFileId: number | null;
    runtimeImportFileId: number | null;

    /**
   * Create a repository DTO
   * @param id the id of the repository
   * @param name the name of the repository
   * @param description the description of the repository
   * @param user the user who owns the repository
   * @param saveFiles the save files in the repository
   * @param entryPointFileId the entry point file
   * @param runtimeFileId the runtime file
   * @param runtimeImportFileId the runtime import file
   */
    constructor(
        id: number | null,
        name: string,
        description: string,
        user: User | null,
        saveFiles: SaveFileDto[] | null,
        entryPointFileId: number | null,
        runtimeFileId: number | null,
        runtimeImportFileId: number | null
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        if (user) {
            this.userName = user.firstname + " " + user.surname;
            this.userEmail = user.email;
            this.userId = user.id;
        }
        this.saveFiles = saveFiles;
        this.link = "/repositories/open?id=" + id;
        this.entryPointFileId = entryPointFileId;
        this.runtimeFileId = runtimeFileId;
        this.runtimeImportFileId = runtimeImportFileId;
    }
}

import { RepositoryDto } from "./repositoryDto";
import { Repository } from "../models/repository";

export class SaveFileDto {
    id: number;
    name: string;
    path: string;
    content: string;
    repositoryId: number | null = null;
    repositoryName: string | null = null;
    isEntryPointFile: boolean;
    isRuntimeFile: boolean;
    isRuntimeImportFile: boolean;

    constructor(
        id: number,
        name: string,
        path: string,
        content: string,
        repository: Repository | null,
        isEntryPointFile = false,
        isRuntimeFile = false,
        isRuntimeImportFile = false
    ) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.content = content;
        if (repository) {
            this.repositoryId = repository.id;
            this.repositoryName = repository.name;
        }
        this.isEntryPointFile = isEntryPointFile;
        this.isRuntimeFile = isRuntimeFile;
        this.isRuntimeImportFile = isRuntimeImportFile;
    }
}

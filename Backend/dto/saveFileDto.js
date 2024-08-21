export class SaveFileDto {
    id;
    name;
    path;
    content;
    repositoryId;
    repositoryName;
    isEntryPointFile;
    isRuntimeFile;
    isRuntimeImportFile

    constructor(id, name, path, content, repository, isEntryPointFile = false, isRuntimeFile = false, isRuntimeImportFile= false) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.content = content;
        if(repository) {
            this.repositoryId = repository.id;
            this.repositoryName = repository.name;
        }
        this.isEntryPointFile = isEntryPointFile;
        this.isRuntimeFile = isRuntimeFile;
        this.isRuntimeImportFile = isRuntimeImportFile;
    }
}
export class Repository {
    id;
    name;
    description;
    userId;
    user;
    saveFiles = [];
    saveFileIds = [];

    constructor(id, name, description, userId, defaultCarlFile, defaultCarlRuntimeFile, defaultCarlImportObjectFile) {
        this.id = id
        this.name = name;
        this.description = description;
        this.userId = userId;
        this.user = null;
        this.saveFiles = [defaultCarlFile, defaultCarlRuntimeFile, defaultCarlImportObjectFile];
        this.saveFileIds = [defaultCarlFile.id, defaultCarlRuntimeFile.id, defaultCarlImportObjectFile.id];
    }
}
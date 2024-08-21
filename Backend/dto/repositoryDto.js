export class RepositoryDto {
    id;
    name;
    description;
    userName;
    userEmail;
    userId;
    saveFiles;
    link;
    entryPointFile;
    runtimeFile;
    runtimeImportFile;

    /**
     * Create a repository DTO
     * @param id the id of the repository
     * @param name the name of the repository
     * @param description the description of the repository
     * @param user the user who owns the repository
     * @param saveFiles the save files in the repository
     * @param entryPointFile the entry point file
     * @param runtimeFile the runtime file
     * @param runtimeImportFile the runtime import file
     */
    constructor(id, name, description, user, saveFiles, entryPointFile, runtimeFile, runtimeImportFile) {
        this.id = id;
        this.name = name;
        this.description = description;
        if(user){
            this.userName = user.firstname + ' ' + user.surname
            this.userEmail = user.email;
            this.userId = user.id;
        }
        this.saveFiles = saveFiles;
        this.link = "/repositories/open?id=" + id;
        this.entryPointFile = entryPointFile;
        this.runtimeFile = runtimeFile;
        this.runtimeImportFile = runtimeImportFile;
    }
}
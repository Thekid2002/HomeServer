export class RepositoryDto {
    id;
    name;
    description;
    userName;
    userEmail;
    userId;
    saveFiles;
    link;

    /**
     * Create a repository DTO
     * @param id the id of the repository
     * @param name the name of the repository
     * @param description the description of the repository
     * @param user the user who owns the repository
     * @param saveFiles the save files in the repository
     */
    constructor(id, name, description, user, saveFiles) {
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
    }
}
export class SaveFileDto {
    id;
    name;
    path;
    content;
    repositoryId;
    repositoryName;


    constructor(id, name, path, content, repository) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.content = content;
        if(repository) {
            this.repositoryId = repository.id;
            this.repositoryName = repository.name;
        }
    }
}
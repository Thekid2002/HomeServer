export class SaveFile {
    id;
    name;
    content;
    path;
    repositoryId;
    repository;

    constructor(id, name, path, repositoryId, content="") {
        this.id = id;
        this.name = name;
        this.path = path;
        this.content = content;
        this.repositoryId = repositoryId;
        this.repository = null;
    }
}
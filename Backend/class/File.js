export class File {
    duration = 0;
    name = '';
    size = 0;
    mimeType = '';

    constructor(name, mimeType, size, duration) {
        this.name = name;
        this.mimeType = mimeType;
        this.size = size;
        this.duration = duration;
    }
}

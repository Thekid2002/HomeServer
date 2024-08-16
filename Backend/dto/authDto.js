export class authDto {

    constructor(token, expirationDateTime) {
        this.token = token;
        this.expirationDateTime = expirationDateTime;
    }

    token;
    expirationDateTime;
}
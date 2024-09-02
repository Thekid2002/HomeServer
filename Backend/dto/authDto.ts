export class authDto {
    constructor(token: string, expirationDateTime: number) {
        this.token = token;
        this.expirationDateTime = expirationDateTime;
    }

    token: string;
    expirationDateTime: number;
}

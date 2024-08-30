import { RoleEnum } from "../models/roleEnum";
import { RepositoryDto } from "./repositoryDto";

export class UserDto {
    id: number | null;
    firstname: string;
    surname: string;
    phone: string;
    email: string;
    role: RoleEnum | null;
    repositories: RepositoryDto[] | null;
    signupDateTime: string | null;

    constructor(
        id: number | null,
        firstname: string,
        surname: string,
        phone: string,
        email: string,
        role: RoleEnum | null,
        repositories: RepositoryDto[] | null,
        signupDateTime: string | null
    ) {
        this.id = id;
        this.firstname = firstname;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.role = role;
        this.repositories = repositories;
        this.signupDateTime = signupDateTime;
    }
}

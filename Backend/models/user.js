import {roleEnum} from "./role.js";
import {generateSalt, hashPassword} from "../services/authorizationService.js";

export class User {
    id;
    firstname;
    surname;
    salt;
    phone;
    email;
    password;
    role;
    token;
    signupDateTime;
    expirationDateTime;
    repositoryIds;
    repositories;


    constructor(id, firstname, surname, phone, email, password) {
        this.id = id;
        this.firstname = firstname;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.role = roleEnum.USER;
        this.signupDateTime = Date.now();
        this.salt = generateSalt();
        this.password = hashPassword(password, this.salt);
        this.repositoryIds = [];
        this.repositories = [];
    }

    toString() {
        return `Name: ${this.firstname}, Phone: ${this.phone}, Email: ${this.email}`;
    }
}
import fs from "fs";
import {roleEnum} from "./role.js";
import {mapUserToUserDto} from "../services/mapper.js";
import {generateSalt, hashPassword} from "../services/authorizationService.js";

const savePath = 'Backend/data/users.json';
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


    constructor(firstname, surname, phone, email, password) {
        this.id = User.getNextId(email);
        this.firstname = firstname;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.role = roleEnum.USER;
        this.signupDateTime = Date.now();
        this.salt = generateSalt();
        this.password = hashPassword(password, this.salt);
    }

    static getAllUsers() {
        this.createFileIfDoesNotExist();
        return JSON.parse(fs.readFileSync(savePath));
    }

    static addUser(user) {
        this.createFileIfDoesNotExist();
        let users = this.getAllUsers();
        users.push(user);
        User.saveAllUsers(users);
    }

    static saveAllUsers(users) {
        fs.writeFileSync(savePath, JSON.stringify(users));
    }

    static saveUser(user) {
        this.createFileIfDoesNotExist()
        let users = this.getAllUsers();
        let index = users.findIndex(u => u.email === user.email);
        users[index] = user;
        User.saveAllUsers(users);
    }

    static getNextId(email) {
        let users = this.getAllUsers();
        let user = users.find(user => user.email === email);
        if(!user){
            return 1;
        }
        return user.id+1;
    }

    static createFileIfDoesNotExist() {
        if(!fs.existsSync(savePath)) {
            fs.writeFileSync(savePath, '[]');
        }
    }

    toString() {
        return `Name: ${this.firstname}, Phone: ${this.phone}, Email: ${this.email}`;
    }
}
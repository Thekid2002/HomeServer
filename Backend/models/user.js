import fs from "fs";
import {roleEnum} from "./role.js";
import {mapUserToUserDto} from "../services/mapper.js";

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
        this.salt = Math.random().toString(36).substring(7);
        this.password = User.hashPassword(password, this.salt);
    }

    static getAllUsers(asDto = true) {
        this.createFileIfDoesNotExist();
        let users = JSON.parse(fs.readFileSync('users.json'));
        if(asDto){
            return users.map(user => mapUserToUserDto(user));
        }
        return users;
    }

    static getUser(email, asDto = true) {
        this.createFileIfDoesNotExist();
        return this.getAllUsers(asDto).find(user => user.email === email);
    }

    static addUser(user) {
        this.createFileIfDoesNotExist();
        let users = this.getAllUsers(false);
        users.push(user);
        User.saveAllUsers(users);
    }

    static userExists(email) {
        this.createFileIfDoesNotExist();
        return this.getAllUsers().some(user => user.email === email);
    }

    static validateToken(token, throwIfInvalid = true) {
        this.createFileIfDoesNotExist();
        let user = this.getAllUsers(false).find(user => user.token === token);
        if (!user) {
            if(throwIfInvalid) {
                throw new Error('Invalid token');
            }
            return null;
        }
        if(user.expirationDateTime < Date.now()){
            if (throwIfInvalid) {
                throw new Error('Token expired');
            }
            return null;
        }
        return user;
    }

    static validateLogin(email, password, asDto = true) {
        this.createFileIfDoesNotExist();
        let user = this.getUser(email, false);
        if (!user) {
            throw new Error(`User ${email} does not exist`);
        }
        console.log(password);
        const inputPassword = User.hashPassword(password, user.salt);
        console.log(inputPassword + ' ' + user.password);
        if(user.password !== inputPassword){
            throw new Error('Invalid password');
        }
        user.token = Math.random().toString(36);
        user.lastLoginDateTime = Date.now();
        user.expirationDateTime = Date.now() + 86400000;
        User.saveUser(user);
        if(asDto) {
            return mapUserToUserDto(user);
        }
        return user;
    }

    static saveAllUsers(users) {
        fs.writeFileSync('users.json', JSON.stringify(users));
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
        if(!fs.existsSync('users.json')) {
            fs.writeFileSync('users.json', '[]');
        }
    }

    static hashPassword(password, salt) {
        let hashPassword = password + salt;
        while (hashPassword.length < 364) {
            hashPassword += password + salt;
        }
        let hash = 0;
        for (let i = 0; i < hashPassword.length; i++) {
            let character = hashPassword.charCodeAt(i);
            hash = ((hash<<5)-hash)+character;
            hash = hash & hash;
        }
        return hash.toString().substring(0, 364);
    }

    static logout(req) {
        if(!req?.token) {
            throw new Error('Token is missing');
        }
        let user = User.getAllUsers(false).find(user => user.token === req.token);
        if(!user) {
            throw new Error('Invalid token');
        }
        console.log("Logging out user: " + user.email);
        user.token = null;
        user.expirationDateTime = null;
        User.saveUser(user);
    }

    toString() {
        return `Name: ${this.firstname}, Phone: ${this.phone}, Email: ${this.email}`;
    }

    static getActiveUser(req, asDto = true) {
        let user = User.validateToken(req.token, false);
        if(asDto) {
            return mapUserToUserDto(user);
        }
        return user;
    }
}
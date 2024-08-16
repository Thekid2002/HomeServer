import fs from "fs";
import {roleEnum} from "./role.js";

export class User {
    name;
    salt;
    phone;
    email;
    password;
    role;
    token;
    signupDateTime;
    lastLoginDateTime;
    expirationDateTime;

    constructor(name, phone, email, password) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.role = roleEnum.USER;
        this.signupDateTime = Date.now();
        this.salt = Math.random().toString(36).substring(7);
        this.password = User.hashPassword(password, this.salt);
    }

    static getAllUsers() {
        this.createFileIfDoesNotExist();
        return JSON.parse(fs.readFileSync("users.json", "utf8"));
    }

    static getUser(email) {
        this.createFileIfDoesNotExist();
        return this.getAllUsers().find(user => user.email === email);
    }

    static addUser(user) {
        this.createFileIfDoesNotExist();
        let users = this.getAllUsers();
        users.push(user);
        User.saveAllUsers(users);
    }

    static userExists(email) {
        this.createFileIfDoesNotExist();
        return this.getAllUsers().some(user => user.email === email);
    }

    static validateToken(token) {
        this.createFileIfDoesNotExist();
        let user = this.getAllUsers().find(user => user.token === token);
        if (!user) {
            throw new Error('Invalid token');
        }
        if(user.expirationDateTime < Date.now()){
            throw new Error('Token expired');
        }
        return true;
    }

    static validateLogin(email, password) {
        this.createFileIfDoesNotExist();
        let user = this.getUser(email);
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

    toString() {
        return `Name: ${this.name}, Phone: ${this.phone}, Email: ${this.email}`;
    }
}
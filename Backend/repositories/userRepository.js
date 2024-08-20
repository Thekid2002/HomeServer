import fs from "fs";
import {User} from "../models/user.js";
import {createRepository, getAllRepositories} from "./repositoryRepository.js";
import {log} from "../services/logger.js";

const savePath = 'Backend/data/users.json';

let users = [];

export function createUser(firstname, surname, phone, email, password) {
    const id = getNextId();
    let user = new User(id, firstname, surname, phone, email, password);
    getAllUsers();
    users.push(user);
    createDefaultRepository(id);
    saveAllUsers()
    return user;
}

export function addRepositoryToUser(user, repository){
    user.repositoryIds.push(repository.id);
    user.repositories.push(repository);
}

export function getAllUsers() {
    log("Getting all users");
    if(users.length !== 0){
        return users;
    }
    createFileIfDoesNotExist();
    users = JSON.parse(fs.readFileSync(savePath, 'utf8'));
    if(users.length === 0){
        return [];
    }
    for (let user of users) {
        user.repositories = getAllRepositories().filter(repository => user.repositoryIds.includes(repository.id));
    }
    return users;
}

export function updateUser(user) {
    let index = users.findIndex(u => u.id === user.id);
    if(index === -1){
        throw new Error("User not found");
    }
    users[index] = user;
    saveAllUsers();
}

function saveAllUsers() {
    let saveUsers = [];
    for(let user of users){
        let saveUser = { ...user };
        saveUser.repositories = [];
        saveUsers.push(saveUser);
    }
    fs.writeFileSync(savePath, JSON.stringify(saveUsers));
    users = [];
}

function getNextId() {
    let users = getAllUsers();
    if(users.length === 0){
        return 1;
    }
    return users[users.length-1].id+1;
}

function createFileIfDoesNotExist() {
    const dir = savePath.substring(0, savePath.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(savePath)) {
        fs.writeFileSync(savePath, '[]');
    }
}


/**
 * Create a default repository for user
 * @param userId the user
 */
function createDefaultRepository(userId){
    createRepository("Default", "Default repository", userId);
}


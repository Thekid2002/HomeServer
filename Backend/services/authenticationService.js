import {User} from "../models/user.js";
import {mapUserToUserDto} from "./mapper.js";

export function signupUser(firstname, surname, phone, email, password) {
    if (User.userExists(email)) {
        throw new Error('User already exists');
    }
    let user = new User(firstname, surname, phone, email, password);
    User.addUser(user);
    console.log('User created successfully ' + user.toString());
    return mapUserToUserDto(user);
}
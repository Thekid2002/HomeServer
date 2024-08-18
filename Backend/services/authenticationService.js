import {User} from "../models/user.js";
import {mapUserToUserDto} from "./mapper.js";
import {getUserByEmail} from "./userService.js";
import {generateToken, hashPassword} from "./authorizationService.js";
import {authDto} from "../dto/authDto.js";

/**
 * Signup a user with the given data
 * @param firstname the firstname of the user
 * @param surname the surname of the user
 * @param phone the phone number of the user
 * @param email the email of the user
 * @param password the password of the user
 * @returns {UserDto}
 */
export function signupUser(firstname, surname, phone, email, password) {
    if (getUserByEmail(email, false)) {
        throw new Error('User already exists');
    }
    let user = new User(firstname, surname, phone, email, password);
    User.addUser(user);
    console.log('User created successfully ' + user.toString());
    return mapUserToUserDto(user);
}

/**
 * Login a user
 * @param email the email of the user
 * @param password the password of the user
 * @returns {authDto}
 */
export function loginUser(email, password) {
    let user = getUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.password !== hashPassword(password, user.salt)) {
        throw new Error('Invalid password');
    }
    user.token = generateToken();
    user.expirationDateTime = Date.now() + 3600000;
    User.saveUser(user);
    return new authDto(user.token, user.expirationDateTime);
}

/**
 * Logout a user
 * @param token the token of the user
 */
export function logoutUser(token) {
    let user = User.getAllUsers().find(user => user.token === token);
    if(!user) {
        throw new Error('Invalid token');
    }
    console.log("Logging out user: " + user.email);
    user.token = null;
    user.expirationDateTime = null;
    User.saveUser(user);
}

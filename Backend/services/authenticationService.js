import {User} from "../models/user.js";
import {mapUserToUserDto} from "./mapper.js";
import {generateToken, hashPassword} from "./authorizationService.js";
import {authDto} from "../dto/authDto.js";
import {createUser, getAllUsers, updateUser} from "../repositories/userRepository.js";
import {log} from "./logger.js";

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
    let existingUser = getAllUsers().find(user => user.email === email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    let user = createUser(firstname, surname, phone, email, password);
    return mapUserToUserDto(user);
}

/**
 * Login a user
 * @param email the email of the user
 * @param password the password of the user
 * @returns {authDto}
 */
export function loginUser(email, password) {
    let user = getAllUsers().find(user => user.email === email);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.password !== hashPassword(password, user.salt)) {
        throw new Error('Invalid password');
    }
    user.token = generateToken();
    user.expirationDateTime = Date.now() + 3600000;
    updateUser(user);
    return new authDto(user.token, user.expirationDateTime);
}

/**
 * Logout a user
 * @param token the token of the user
 */
export function logoutUser(token) {
    let user = getAllUsers().find(user => user.token === token);
    if(!user) {
        throw new Error('Invalid token');
    }
    console.log("Logging out user: " + user.email);
    user.token = null;
    user.expirationDateTime = null;
    updateUser(user);
}

import {User} from "../models/user.js";
import {mapUserToUserDto} from "./mapper.js";
import {validateToken} from "./authorizationService.js";

/**
 * Get a user by email
 * @param email the email of the user
 * @param throwIfNoUser should an error be thrown if no user is found
 * @returns {User|null}
 */
export function getUserByEmail(email, throwIfNoUser = true) {
    let user = getAllUsers().find(user => user.email === email);
    if (!user && throwIfNoUser) {
        throw new Error('User not found');
    }
    return user;
}

/**
 * Get all users as UserDto
 * @returns {UserDto[]}
 */
export function getAllUsersAsDto() {
    let users = User.getAllUsers();
    return users.map(user => mapUserToUserDto(user));
}

/**
 * Get all users
 * @returns {User[]}
 */
export function getAllUsers(){
    return User.getAllUsers();
}

/**
 * Get the active user from the request
 * @param token the token of the current user
 * @param throwIfNoActiveUser should an error be thrown if no active user is found
 * @returns {User|null}
 */
export function getActiveUser(token, throwIfNoActiveUser = true) {
    let user = validateToken(token, false);
    if (!user) {
        if (throwIfNoActiveUser) {
            throw new Error('No active user');
        }
        return null;
    }
    return user;
}

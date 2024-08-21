import {validateToken} from "./authorizationService.js";

/**
 * Get the active user from the request
 * @param token the token of the current user
 * @param throwIfNoActiveUser should an error be thrown if no active user is found
 * @returns {Promise<User | null>} the active user
 */
export async function getActiveUser(token, throwIfNoActiveUser = true) {
    let user = validateToken(token, false);
    if (!user) {
        if (throwIfNoActiveUser) {
            throw new Error('No active user');
        }
        return null;
    }
    return user;
}

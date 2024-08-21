import crypto from "crypto";
import {findUserByToken} from "../repositories/userRepository.js";

/**
 * Set the token and role of a request
 * @param req the request
 */
export async function setTokenVariable(req) {
    req.role = null;
    req.token = null;
    if(!req.headers.cookie){
        return;
    }
    let cookies = req.headers.cookie.split(' ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token'));
    if(!tokenCookie){
        return;
    }
    let token = tokenCookie.split('=')[1];
    if (!token) {
        return;
    }
    req.token = token;
    let user = await findUserByToken(token);
    if(!user){
        console.log("User not found with token: " + token);
        return;
    }
    req.role = parseInt(user.role);
}

/**
 * Check if a user is authorized with the given roles
 * @param req the request
 * @param authorizedRoles the roles that are authorized
 * @param throwIfNotAuthorized should an error be thrown if the user is not authorized
 * @returns {Promise<boolean>} is the user authorized
 */
export async function checkIsAuthorizedWithRoles(req, authorizedRoles, throwIfNotAuthorized = true) {
    if(!req.role){
        if (throwIfNotAuthorized) {
            throw new Error('Role is missing');
        }
        return false;
    }
    if(!authorizedRoles){
        if(throwIfNotAuthorized){
            throw new Error('Authorized roles are missing');
        }
        return false;
    }
    if(!authorizedRoles.includes(req.role)){
        console.error("Role not authorized: " + req.role + " not in " + authorizedRoles.toString());
        if(throwIfNotAuthorized){
            throw new Error('Not authorized');
        }
        return false;
    }
    return true;
}

/**
 * Check if a user is logged in
 * @param token the token of the user
 * @param role the role of the user
 * @param throwIfNotLoggedIn
 * @returns {Promise<boolean>}
 */
export async function checkIsLoggedIn(token, role, throwIfNotLoggedIn = true) {
    if(!token){
        if(throwIfNotLoggedIn) {
            throw new Error('Token is missing');
        }
        return false;
    }
    if(role === null || role === undefined){
        if(throwIfNotLoggedIn){
            throw new Error('Not logged in');
        }
        return false;
    }
    return true;
}

/**
 * Generate a token for a user
 * @returns {string} the token
 */
export function generateToken() {
    return crypto.randomBytes(64).toString('hex');
}

/**
 * Validate a token
 * @param token
 * @param throwIfInvalid
 * @returns {User | null}
 */
export async function validateToken(token, throwIfInvalid = true) {
    if(!token){
        if(throwIfInvalid){
            throw new Error('Token is missing');
        }
        return null;
    }
    let user = await findUserByToken(token);
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

/**
 * Generate a random salt
 * @returns {string}
 */
export function generateSalt() {
    return crypto.randomBytes(96).toString('hex');
}

/**
 * Hash a password with a salt
 * @param password the password
 * @param salt the salt
 * @returns {string} the hashed password
 */
export function hashPassword(password, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256');
    return hash.toString('hex');
}

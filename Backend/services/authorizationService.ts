import crypto from "crypto";
import { Request } from "express";
import { findUserByToken } from "../repositories/userRepository";
import { User } from "../models/user";
import { RoleEnum } from "../models/roleEnum";

/**
 * Set the token and role of a request
 * @param req the request
 * @param throwIfNull should an error be thrown if the user is not found
 */
export async function getUserFromRequest(
    req: Request,
    throwIfNull: boolean = false
): Promise<User | null> {
    if (!req.headers.cookie) {
        if (throwIfNull) {
            throw new Error("Cookie is missing");
        }
        return null;
    }
    const cookies: string[] = req.headers.cookie.split(" ");
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token"));
    if (!tokenCookie) {
        if (throwIfNull) {
            throw new Error("Token cookie is missing");
        }
        return null;
    }
    const token = tokenCookie.split("=")[1].split(";")[0];
    if (!token) {
        if (throwIfNull) {
            throw new Error("Token is missing");
        }
        return null;
    }
    const user = await findUserByToken(token);
    if (!user) {
        if (throwIfNull) {
            throw new Error("User not found");
        }
        console.log("User not found with token: " + token);
        return null;
    }
    return user;
}

/**
 * Check if a user is authorized with the given roles
 * @param req the request
 * @param authorizedRoles the roles that are authorized
 * @param throwIfNotAuthorized should an error be thrown if the user is not authorized
 */
export async function checkIsAuthorizedWithRoles(
    req: Request,
    authorizedRoles: RoleEnum[],
    throwIfNotAuthorized = true
) {
    const user = await getUserFromRequest(req, throwIfNotAuthorized);

    if (!user) {
        return false;
    }

    if (!user.role) {
        if (throwIfNotAuthorized) {
            throw new Error("Role is missing");
        }
        return false;
    }

    if (!authorizedRoles) {
        if (throwIfNotAuthorized) {
            throw new Error("Authorized roles are missing");
        }
        return false;
    }

    if (!authorizedRoles.includes(user.role)) {
        console.error(
            "Role not authorized: " +
        user.role +
        " not in " +
        authorizedRoles.toString()
        );
        if (throwIfNotAuthorized) {
            throw new Error("Not authorized");
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
    return crypto.randomBytes(64).toString("hex");
}

/**
 * Validate a token
 * @param token
 * @param throwIfInvalid
 * @returns {User | null}
 */
export async function validateToken(
    token: string,
    throwIfInvalid: boolean = true
): Promise<User | null> {
    if (!token) {
        if (throwIfInvalid) {
            throw new Error("Token is missing");
        }
        return null;
    }
    const user = await findUserByToken(token);
    if (!user) {
        if (throwIfInvalid) {
            throw new Error("Invalid token");
        }
        return null;
    }
    if (user.expirationDateTime && user.expirationDateTime < Date.now()) {
        if (throwIfInvalid) {
            throw new Error("Token expired");
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
    return crypto.randomBytes(96).toString("hex");
}

/**
 * Hash a password with a salt
 * @param password the password
 * @param salt the salt
 * @returns {string} the hashed password
 */
export function hashPassword(password: string, salt: string) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha256");
    return hash.toString("hex");
}

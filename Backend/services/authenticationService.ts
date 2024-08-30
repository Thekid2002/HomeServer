import { mapUserToUserDto } from "./mapper";
import {
    generateToken,
    hashPassword
} from "./authorizationService";
import { authDto } from "../dto/authDto";
import {
    createUser,
    findUserByEmail,
    updateUser
} from "../repositories/userRepository";
import { sequelize } from "./database";
import { User } from "../models/user";
import { RoleEnum } from "../models/roleEnum";
import { UserDto } from "../dto/userDto";
import {Transaction} from "sequelize";

/**
 * Signup a user with the given data
 * @param firstname the firstname of the user
 * @param surname the surname of the user
 * @param phone the phone number of the user
 * @param email the email of the user
 * @param password the password of the user
 * @param transaction the transaction to use
 */
export async function signupUser(
    firstname: string,
    surname: string,
    phone: string,
    email: string,
    password: string,
    transaction: Transaction
): Promise<UserDto> {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }
    const user = await createUser(
        firstname,
        surname,
        phone,
        email,
        password,
        RoleEnum.USER,
        transaction
    );
    return await mapUserToUserDto(user);
}

/**
 * Login a user
 * @param email the email of the user
 * @param password the password of the user
 * @param transaction the transaction to use
 */
export async function loginUser(email: string, password: string, transaction: Transaction): Promise<authDto> {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.password !== hashPassword(password, user.salt)) {
        throw new Error("Invalid password");
    }
    user.token = generateToken();
    user.expirationDateTime = Date.now() + 3600000;
    await updateUser(user, transaction);
    return new authDto(user.token, user.expirationDateTime);
}

/**
 * Logout a user
 * @param user the user to logout
 * @param transaction the transaction to use
 */
export async function logoutUser(user: User, transaction: Transaction): Promise<void> {
    console.log("Logging out user: " + user.email);
    user.token = null;
    user.expirationDateTime = null;
    await updateUser(user, transaction);
}

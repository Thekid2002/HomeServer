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

/**
 * Signup a user with the given data
 * @param firstname the firstname of the user
 * @param surname the surname of the user
 * @param phone the phone number of the user
 * @param email the email of the user
 * @param password the password of the user
 */
export async function signupUser(
    firstname: string,
    surname: string,
    phone: string,
    email: string,
    password: string
): Promise<UserDto> {
    const transaction = await sequelize.transaction();
    try {
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
        await transaction.commit();
        return await mapUserToUserDto(user);
    } catch (e) {
        console.error("Error signing up user:", e);
        await transaction.rollback();
        throw e;
    }
}

/**
 * Login a user
 * @param email the email of the user
 * @param password the password of the user
 */
export async function loginUser(email: string, password: string): Promise<authDto> {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.password !== hashPassword(password, user.salt)) {
        throw new Error("Invalid password");
    }
    user.token = generateToken();
    user.expirationDateTime = Date.now() + 3600000;
    await updateUser(user);
    return new authDto(user.token, user.expirationDateTime);
}

/**
 * Logout a user
 * @param user the user to logout
 */
export async function logoutUser(user: User): Promise<void> {
    console.log("Logging out user: " + user.email);
    user.token = null;
    user.expirationDateTime = null;
    await updateUser(user);
}

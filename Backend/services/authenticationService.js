import {mapUserToUserDto} from "./mapper.js";
import {generateToken, hashPassword} from "./authorizationService.js";
import {authDto} from "../dto/authDto.js";
import {createUser, findUserByEmail, findUserByToken, updateUser} from "../repositories/userRepository.js";
import {sequelize} from "./database.js";
import {roleEnum} from "../models/role.js";

/**
 * Signup a user with the given data
 * @param firstname the firstname of the user
 * @param surname the surname of the user
 * @param phone the phone number of the user
 * @param email the email of the user
 * @param password the password of the user
 * @returns {UserDto}
 */
export async function signupUser(firstname, surname, phone, email, password) {
    const transaction = await sequelize.transaction();
    try {
        let existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        let user = await createUser(firstname, surname, phone, email, password, roleEnum.USER, transaction);
        await transaction.commit();
        return await mapUserToUserDto(user);
    }catch (e) {
        console.error('Error signing up user:', e);
        await transaction.rollback();
        throw e;
    }
}

/**
 * Login a user
 * @param email the email of the user
 * @param password the password of the user
 * @returns {Promise<authDto>}
 */
export async function loginUser(email, password) {
    let user = await findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.password !== hashPassword(password, user.salt)) {
        throw new Error('Invalid password');
    }
    user.token = generateToken();
    user.expirationDateTime = Date.now() + 3600000;
    await updateUser(user);
    return new authDto(user.token, user.expirationDateTime);
}

/**
 * Logout a user
 * @param token the token of the user
 */
export async function logoutUser(token) {
    let user = await findUserByToken(token);
    if(!user) {
        throw new Error('Invalid token');
    }
    console.log("Logging out user: " + user.email);
    user.token = null;
    user.expirationDateTime = null;
    await updateUser(user);
}

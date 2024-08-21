import { createRepository } from "./repositoryRepository.js";
import { log } from "../services/logger.js";
import {roleEnum} from "../models/role.js";
import {generateSalt, hashPassword} from "../services/authorizationService.js";
import {Repository, SaveFile, User} from "../services/database.js";

// Create a new user
export async function createUser(firstname, surname, phone, email, password, role = roleEnum.USER, transaction) {
    const salt = generateSalt();
    password = hashPassword(password, salt);
    // Create the user in the database
    const user = await User.create({
        firstname,
        surname,
        phone,
        email,
        password,
        salt,
        role,
        signupDateTime: Date.now(),
    }, { transaction });

    // Create a default repository for the user
    await createDefaultRepository(user.id, transaction);

    return user;
}

// Fetch all users from the database
export async function getAllUsers() {
    log("Getting all users");

    // Fetch users and include associated repositories
    const users = await User.findAll({
        include: [
            {
                model: Repository,
                as: 'repositories',
                include: [
                    {
                        model: SaveFile,
                        as: 'saveFiles'
                    }
                ]
            }
        ]
    });

    return users;
}

// Find a user by email
export async function findUserByEmail(email) {
    const user = await User.findOne({
        where: { email },
        include: [
            {
                model: Repository,
                as: 'repositories',
                include: [
                    {
                        model: SaveFile,
                        as: 'saveFiles'
                    }
                ]
            }
        ]
    });

    return user;
}

// Find a user by id
export async function findUserById(userId) {
    const user = await User.findByPk(userId, {
        include: [
            {
                model: Repository,
                as: 'repositories',
                include: [
                    {
                        model: SaveFile,
                        as: 'saveFiles'
                    }
                ]
            }
        ]
    });

    return user;
}

/**
 * Find a user by token
 * @param token the token of the user
 * @returns {Promise<User | null>}
 */
export async function findUserByToken(token) {
    const user = await User.findOne({
        where: { token },
        include: [
            {
                model: Repository,
                as: 'repositories',
                include: [
                    {
                        model: SaveFile,
                        as: 'saveFiles'
                    }
                ]
            }
        ]
    });

    return user;
}

// Update user details
export async function updateUser(user) {
    const currentUser = await User.findByPk(user.id);
    if (!currentUser) {
        throw new Error("User not found");
    }

    await currentUser.update({
        firstname: user.firstname,
        surname: user.surname,
        phone: user.phone,
        email: user.email,
        password: user.password,
        salt: user.salt,
        role: user.role,
        token: user.token,
        expirationDateTime: user.expirationDateTime,
    });

    console.log(`User with id:"${user.id}" updated successfully`);
    return user;
}

// Delete a user
export async function deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error("User not found with id: " + id);
    }

    await user.destroy();
}

// Create a default repository for the user
async function createDefaultRepository(userId, transaction) {
    return await createRepository("Default", "Default repository", userId, transaction);
}

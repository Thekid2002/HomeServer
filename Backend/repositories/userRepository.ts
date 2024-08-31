import { createRepository } from "./repositoryRepository";
import { log } from "../services/logger";
import { generateSalt, hashPassword } from "../services/authorizationService";
import { User } from "../models/user";
import { SaveFile } from "../models/saveFile";
import { Repository } from "../models/repository";
import { RoleEnum } from "../models/roleEnum";
import { Transaction } from "sequelize";

// Create a new user
export async function createUser(
    firstname: string,
    surname: string,
    phone: string,
    email: string,
    password: string,
    role = RoleEnum.USER,
    transaction: Transaction
) {
    const salt = generateSalt();
    password = hashPassword(password, salt);
    // Create the user in the database
    const user = await User.create(
        {
            firstname,
            surname,
            phone,
            email,
            password,
            salt,
            role,
            signupDateTime: Date.now()
        },
        { transaction }
    );

    // Create a default repository for the user
    await createDefaultRepository(user.id, transaction);

    return user;
}

// Fetch all users from the database
export async function getAllUsers(
    includeRepositories = false,
    includeSaveFiles = false
): Promise<User[]> {
    if (includeSaveFiles && !includeRepositories) {
        throw new Error("Cannot include save files without repositories");
    }

    const saveFileInclude = includeSaveFiles
        ? [
            {
                model: SaveFile,
                as: "saveFiles"
            }
        ]
        : [];

    const repoInclude = includeRepositories
        ? [
            {
                model: Repository,
                as: "repositories",
                saveFileInclude
            }
        ]
        : [];
    log("Getting all users");

    // Fetch users and include associated repositories
    const users = await User.findAll({
        include: repoInclude
    });

    return users;
}

// Find a user by email
export async function findUserByEmail(
    email: string,
    includeSaveFiles: boolean = false,
    includeRepositories: boolean = false
): Promise<User | null> {
    if (includeSaveFiles && !includeRepositories) {
        throw new Error("Cannot include save files without repositories");
    }

    const saveFileInclude = includeSaveFiles
        ? [
            {
                model: SaveFile,
                as: "saveFiles"
            }
        ]
        : [];

    const repoInclude = includeRepositories
        ? [
            {
                model: Repository,
                as: "repositories",
                saveFileInclude
            }
        ]
        : [];

    const user = await User.findOne({
        where: { email },
        include: repoInclude
    });

    return user;
}

// Find a user by id
export async function findUserById(
    userId: number,
    includeSaveFiles: boolean = false,
    includeRepositories: boolean = false,
    throwIfNotFound = true
): Promise<User | null> {
    if (includeSaveFiles && !includeRepositories) {
        throw new Error("Cannot include save files without repositories");
    }

    const saveFileInclude = includeSaveFiles
        ? [
            {
                model: SaveFile,
                as: "saveFiles"
            }
        ]
        : [];

    const repoInclude = includeRepositories
        ? [
            {
                model: Repository,
                as: "repositories",
                saveFileInclude
            }
        ]
        : [];

    const user = await User.findByPk(userId, {
        include: repoInclude
    });

    if (!user && throwIfNotFound) {
        throw new Error("User not found with id: " + userId);
    }

    return user;
}

/**
 * Find a user by token
 * @param token the token of the user
 */
export async function findUserByToken(
    token: string,
    includeSaveFiles: boolean = false,
    includeRepositories: boolean = false
): Promise<User | null> {
    if (includeSaveFiles && !includeRepositories) {
        throw new Error("Cannot include save files without repositories");
    }

    const saveFileInclude = includeSaveFiles
        ? [
            {
                model: SaveFile,
                as: "saveFiles"
            }
        ]
        : [];

    const repoInclude = includeRepositories
        ? [
            {
                model: Repository,
                as: "repositories",
                saveFileInclude
            }
        ]
        : [];

    const user = await User.findOne({
        where: { token },
        include: repoInclude
    });

    return user;
}

// Update user details
export async function updateUser(user: User, transaction: Transaction | null): Promise<User> {
    const updateUser = await User.findByPk(user.id);
    if (!updateUser) {
        throw new Error("User not found");
    }

    if(transaction) {
        await updateUser.update({
            firstname: user.firstname,
            surname: user.surname,
            phone: user.phone,
            email: user.email,
            password: user.password,
            salt: user.salt,
            role: user.role,
            token: user.token,
            expirationDateTime: user.expirationDateTime
        },  { transaction });
    }else {
        await updateUser.update({
            firstname: user.firstname,
            surname: user.surname,
            phone: user.phone,
            email: user.email,
            password: user.password,
            salt: user.salt,
            role: user.role,
            token: user.token,
            expirationDateTime: user.expirationDateTime
        });
    }


    console.log(`User with id:"${user.id}" updated successfully`);
    return user;
}

// Delete a user
export async function deleteUser(id: number): Promise<void> {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error("User not found with id: " + id);
    }

    await user.destroy();
}

// Create a default repository for the user
async function createDefaultRepository(userId: number, transaction: Transaction): Promise<Repository> {
    return await createRepository(
        "Default",
        "Default repository",
        userId,
        null,
        transaction
    );
}

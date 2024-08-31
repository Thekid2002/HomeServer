import express from "express";
import {
    renderPageFromHtmlFile,
    renderPageObjectCreateEditPage,
    renderTablePageWithBasicLayout
} from "../services/pageLayout";
import { checkIsAuthorizedWithRoles, getUserFromRequest } from "../services/authorizationService";
import { RoleEnum } from "../models/roleEnum";
import { mapUserListToUserDtoList, mapUserToUserDto } from "../services/mapper";
import { getUserLayout } from "../services/tableLayoutService";
import { createUser, deleteUser, findUserById, getAllUsers, updateUser } from "../repositories/userRepository";
import { sequelize } from "../services/database";
import { Transaction } from "sequelize";
import { User } from "../models/user";
import {checkEmail, checkEnum, checkPhone, checkString} from "../services/checkService";


export const UserController = express.Router();
export const UserRoute = "user";

UserController.get("/profile", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [
            RoleEnum.SUPER_ADMIN,
            RoleEnum.ADMIN,
            RoleEnum.USER
        ]);
        const layout = getUserLayout();
        res.send(
            await renderPageObjectCreateEditPage(
                "Profile",
                "Profile",
                await mapUserToUserDto(await getUserFromRequest(req, true) as User),
                layout,
                req,
                false
            )
        );
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.post("/profile", async (req, res) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        await checkIsAuthorizedWithRoles(req, [
            RoleEnum.SUPER_ADMIN,
            RoleEnum.ADMIN,
            RoleEnum.USER
        ]);

        const firstname = checkString(req.body.firstname, false, 2, 256);
        const surname = checkString(req.body.surname, false, 2, 256);
        const phone = checkString(req.body.phone, false, 2, 256);
        const email = checkString(req.body.email, false, 2, 256);

        const user: User = await getUserFromRequest(req, true) as User;
        user.firstname = firstname;
        user.surname = surname;
        user.phone = phone;
        user.email = email;

        await updateUser(user, transaction);
        await transaction.commit();
        res.send("User updated");
    } catch (e: any) {
        await transaction.rollback();
        console.error(e);
        res.status(500).send(e.message);
    }
});

UserController.get("/settings", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [
            RoleEnum.SUPER_ADMIN,
            RoleEnum.ADMIN,
            RoleEnum.USER
        ]);
        res.send(await renderPageFromHtmlFile("Backend/views/", "settings", req));
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.get("/allUsers", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const allUsers = await mapUserListToUserDtoList(await getAllUsers());
        const layout = getUserLayout();
        res.send(
            await renderTablePageWithBasicLayout(
                "AllUsers",
                "AllUsers",
                allUsers,
                layout,
                req,
                true,
                true
            )
        );
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.get("/edit", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const queryId = req.query.id;
        if (!queryId || queryId !instanceof String) {
            throw new Error("No id provided");
        }
        const id = parseInt(req.query.id as string);
        if(!id) {
            throw new Error("No valid id provided");
        }
        const user: User | null = await findUserById(id, true, true, true);
        if(!user) {
            throw new Error("User not found with id: " + id);
        }
        const layout = getUserLayout(false);
        res.send(
            await renderPageObjectCreateEditPage(
                "createEditUser",
                "Edit User",
                await mapUserToUserDto(user!),
                layout,
                req,
                false
            )
        );
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.get("/create", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const layout = getUserLayout(true);
        res.send(
            await renderPageObjectCreateEditPage(
                "createEditUser",
                "Create User",
                null,
                layout,
                req,
                true
            )
        );
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.post("/edit", async (req, res) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        await checkIsAuthorizedWithRoles(req, [RoleEnum.SUPER_ADMIN]);

        const queryId = req.query.id;
        if (!queryId || typeof queryId !== "string") {
            throw new Error("No id provided");
        }

        const id = parseInt(queryId);
        const firstname = checkString(req.body.firstname, false, 2, 256);
        const surname = checkString(req.body.surname, false, 2, 256);
        const phone = checkPhone(req.body.phone, false);
        const email = checkEmail(req.body.email, false);
        const role = checkEnum(parseInt(req.body.role), RoleEnum, false);

        let user = await findUserById(id, false, false, true);
        if (!user) {
            throw new Error("User not found with id: " + id);
        }

        user.firstname = firstname;
        user.surname = surname;
        user.phone = phone;
        user.email = email;
        user.role = role;

        await updateUser(user, transaction);
        await transaction.commit();
        res.send("User updated");
    } catch (e: any) {
        await transaction.rollback();
        console.error(e);
        res.status(500).send(e.message);
    }
});

UserController.post("/create", async (req, res) => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const firstname = checkString(req.body.firstname, false, 2, 256);
        const surname = checkString(req.body.surname, false, 2, 256);
        const phone = checkPhone(req.body.phone, false);
        const email = checkEmail(req.body.email, false);
        const password = checkString(req.body.password, false, 8, 256);
        let role = checkEnum(parseInt(req.body.role), RoleEnum, false);
        await createUser(
            firstname,
            surname,
            phone,
            email,
            password,
            role,
            transaction
        );
        await transaction.commit();
        res.send("User created");
    } catch (e: any) {
        await transaction.rollback();
        console.error(e);
        res.status(500).send(e.message);
    }
});

UserController.delete("/delete", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const queryId = req.query.id;
        if (!queryId || queryId !instanceof String) {
            throw new Error("No id provided");
        }
        const id = parseInt(queryId as string);
        await deleteUser(id);
        res.send("User deleted");
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

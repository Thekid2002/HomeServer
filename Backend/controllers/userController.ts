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
import { checkEnum, checkString } from "../services/checkService";


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
                req
            )
        );
    } catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.post("/profile", async (req, res) => {
    try {
        await checkIsAuthorizedWithRoles(req, [
            RoleEnum.SUPER_ADMIN,
            RoleEnum.ADMIN,
            RoleEnum.USER
        ]);

        const firstname = checkString(req.body.firstname, false, 2, 256);
        const surname = checkString(req.body.surname, false, 2, 256);
        const phone = checkString(req.body.phone, false, 2, 256);
        const role = checkEnum(req.body.role, RoleEnum);

        const user: User = await getUserFromRequest(req, true) as User;
        user.firstname = firstname;
        user.surname = surname;
        user.phone = phone;
        if (user.role === RoleEnum.SUPER_ADMIN) {
            user.role = role;
        }
        await updateUser(user);
        res.send("User updated");
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
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
        const title = id ? "Edit User" : "Create User";
        let user: User | null = null;
        if (id) {
            user = await findUserById(id, true, true, true);
            console.log(await user!.getRepositories());
        }
        const layout = getUserLayout(!id);
        res.send(
            await renderPageObjectCreateEditPage(
                "createEditUser",
                title,
                user ? await mapUserToUserDto(user): null,
                layout,
                req
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
        await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ]);
        const queryId = req.query.id;
        if (!queryId || queryId !instanceof String) {
            throw new Error("No id provided");
        }
        const id = parseInt(queryId as string);
        const firstname = req.body.firstname;
        const surname = req.body.surname;
        const phone = req.body.phone;
        const email = req.body.email;
        const password = req.body.password;
        const role = parseInt(req.body.role);
        let user;
        if (id) {
            user = await findUserById(id, false, false, true);
      user!.firstname = firstname;
      user!.surname = surname;
      user!.phone = phone;
      user!.email = email;
      user!.role = role;
        }
        if (id) {
            await updateUser(user!);
            res.send("User updated");
        } else {
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
        }
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

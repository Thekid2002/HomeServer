import express from "express";
import {renderPageFromHtmlFile, renderPageObjectCreateEditPage, renderTablePageWithBasicLayout} from "../services/pageLayout.js";
import {checkIsAuthorizedWithRoles} from "../services/authorizationService.js";
import {roleEnum} from "../models/role.js";
import {getActiveUser} from "../services/userService.js";
import {mapUserListToUserDtoList, mapUserToUserDto} from "../services/mapper.js";
import {getUserLayout} from "../services/tableLayoutService.js";
import {createUser, findUserById, getAllUsers, updateUser} from "../repositories/userRepository.js";
import {UserDto} from "../dto/userDto.js";
import {sequelize} from "../services/database.js";

export const UserController = express.Router();
export const UserRoute = 'user';

UserController.get("/profile",  async (req, res) => {
    try{
        await checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER]);
        let layout = getUserLayout(req.role);
        res.send(await renderPageObjectCreateEditPage("Profile", "Profile", await mapUserToUserDto(await getActiveUser(req.token)), layout, req));
    } catch (e){
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.post("/profile",  async (req, res) => {
    try{
        await checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER])
        let user = await getActiveUser(req.token, true);
        user.firstname = req.body.firstname;
        user.surname = req.body.surname;
        user.phone = req.body.phone;
        if(req.role === roleEnum.SUPER_ADMIN) {
            user.role = req.body.role;
        }
        await updateUser(user);
        res.send("User updated");
    } catch (e){
        console.error(e);
        res.status(500).send(e);
    }
});

UserController.get("/settings",  async (req, res) => {
    try{
        await checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER])
        res.send(await renderPageFromHtmlFile("Backend/views/", "settings", req));
    } catch (e){
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }});

UserController.get("/allUsers", async (req, res) => {
    try{
        await checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN])
        let allUsers = await mapUserListToUserDtoList(await getAllUsers())
        let layout = getUserLayout(req.role);
        res.send(await renderTablePageWithBasicLayout("AllUsers", "AllUsers", allUsers, layout, req, true));
    }catch (e) {
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.get("/edit",  async (req, res) => {
    try{
        await checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN])
        const id = parseInt(req.query.id);
        const title = id ? "Edit User" : "Create User";
        let user = new UserDto(null, "", "", "", "", 0, "");
        if(id){
            user = await findUserById(id);
        }
        let layout = getUserLayout(req.role, !id);
        res.send(await renderPageObjectCreateEditPage("createEditUser", title, await mapUserToUserDto(user), layout, req));
    } catch (e){
        console.error(e);
        res.send(await renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.post("/edit", async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        await checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN])
        const id = parseInt(req.query.id);
        const firstname = req.body.firstname;
        const surname = req.body.surname;
        const phone = req.body.phone;
        const email = req.body.email;
        const password = req.body.password;
        const role = parseInt(req.body.role);
        let user;
        if(id) {
            user = await findUserById(id);
            user.firstname = firstname;
            user.surname = surname;
            user.phone = phone;
            user.email = email;
            user.role = role;
        }
        if(id) {
            await updateUser(user);
            res.send("User updated");
        }else {
            await createUser(firstname, surname, phone, email, password, role, transaction);
            await transaction.commit();
            res.send("User created");
        }
    } catch (e){
        await transaction.rollback();
        console.error(e);
        res.status(500).send(e);
    }
});
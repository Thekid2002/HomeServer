import express from "express";
import {renderPageFromHtmlFile, renderPageObjectCreateEditPage, renderTablePageWithBasicLayout} from "../services/pageLayout.js";
import {checkIsAuthorizedWithRoles} from "../services/authorizationService.js";
import {roleEnum} from "../models/role.js";
import {getActiveUser} from "../services/userService.js";
import {mapUserListToUserDtoList, mapUserToUserDto} from "../services/mapper.js";
import {getUserLayout} from "../services/tableLayoutService.js";
import {getAllUsers, updateUser} from "../repositories/userRepository.js";

export const UserController = express.Router();
export const UserRoute = 'user';

UserController.get("/profile", (req, res) => {
    try{
        checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER]);
        let layout = getUserLayout(req.role);
        res.send(renderPageObjectCreateEditPage("Profile", "Profile", mapUserToUserDto(getActiveUser(req.token)), layout, req));
    } catch (e){
        console.error(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.post("/profile", (req, res) => {
    try{
        checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER])
        let user = getActiveUser(req.token, true);
        user.firstname = req.body.firstname;
        user.surname = req.body.surname;
        user.phone = req.body.phone;
        if(req.role === roleEnum.SUPER_ADMIN) {
            user.role = req.body.role;
        }
        updateUser(user);
        res.send("User updated");
    } catch (e){
        console.error(e);
        res.status(500).send(e);
    }
});

UserController.get("/settings", (req, res) => {
    try{
        checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER])
        res.send(renderPageFromHtmlFile("Backend/views/", "settings", req));
    } catch (e){
        console.error(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }});

UserController.get("/allUsers", (req, res) => {
    try{
        checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN])
        let allUsers = mapUserListToUserDtoList(getAllUsers())
        let layout = getUserLayout(req.role);
        res.send(renderTablePageWithBasicLayout("AllUsers", "AllUsers", allUsers, layout, req, true));
    }catch (e) {
        console.error(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.get("/edit", (req, res) => {
    try{
        checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN])
        const id = parseInt(req.query.id);
        const title = id ? "Edit User" : "Create User";
        let user = getAllUsers().find(user => user.id === id);
        let layout = getUserLayout(req.role);
        res.send(renderPageObjectCreateEditPage("createEditUser", title, mapUserToUserDto(user), layout, req));
    } catch (e){
        console.error(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});

UserController.post("/edit", (req, res) => {
    try{
        checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN])
        const id = parseInt(req.query.id);
        let user = getAllUsers().find(user => user.id === id);
        user.firstname = req.body.firstname;
        user.surname = req.body.surname;
        user.phone = req.body.phone;
        user.email = req.body.email;
        user.role = req.body.role;
        updateUser(user);
        res.send("User updated");
    } catch (e){
        console.error(e);
        res.status(500).send(e);
    }
});
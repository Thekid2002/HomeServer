import express from "express";
import {renderPageFromHtmlFile, renderPageObjectCreateEditPage, renderTablePage} from "../services/pageLayout.js";
import {checkIsAuthorizedWithRoles} from "../services/authorizationService.js";
import {roleEnum} from "../models/role.js";
import {User} from "../models/user.js";
import {getActiveUser, getAllUsersAsDto} from "../services/userService.js";
import {mapUserToUserDto} from "../services/mapper.js";

export const UserController = express.Router();
export const UserRoute = 'user';

UserController.get("/profile", (req, res) => {
    try{
        checkIsAuthorizedWithRoles(req,[roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER])
        res.send(renderPageObjectCreateEditPage("Profile", mapUserToUserDto(getActiveUser(req.token)), req));
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
        user.email = req.body.email;
        User.saveUser(user);
        res.send(renderPageObjectCreateEditPage("Profile", user, req));
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
        let allUsers = getAllUsersAsDto();
        res.send(renderTablePage("AllUsers", allUsers, ["id", "firstname", "surname", "role", "email", "phone"], req));
    }catch (e) {
        console.error(e);
        res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
    }
});
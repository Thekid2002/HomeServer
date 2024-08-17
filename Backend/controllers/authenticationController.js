import express from 'express';
import {User} from "../models/user.js";
import {signupUser} from "../services/authenticationService.js";
import {checkEmail, checkPhone, checkString} from "../services/checkService.js";
import {authDto} from "../dto/authDto.js";
import {renderPageFromHtmlFile} from "../services/pageLayout.js";
import {checkIsAuthorizedWithRoles} from "../services/authorizationService.js";
import {roleEnum} from "../models/role.js";

export const AuthenticationRouter = express.Router();
export const AuthenticationRoute = 'authentication';

AuthenticationRouter.get("/signup", (req, res) => {
    res.send(renderPageFromHtmlFile('Backend/views/', "signup", req));
});

AuthenticationRouter.get("/login", (req, res) => {
    res.send(renderPageFromHtmlFile('Backend/views/', "login", req));
});

AuthenticationRouter.post("/signup", (req, res) => {
    const firstname = req.body.firstname;
    const surname = req.body.surname;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    try{
        checkString(firstname);
        checkString(surname);
        checkPhone(phone);
        checkEmail(email);
        checkString(password, 8);
        res.send(JSON.stringify(signupUser(firstname, surname, phone, email, password)));
    }catch (e){
        console.error(e);
        res.status(500).send(e.message);
    }
});


AuthenticationRouter.post("/login",  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Logging in user: " + email + " with password: " + password);
    try{
        let user = User.validateLogin(email, password, false);
        res.send(JSON.stringify(new authDto(user.token, user.expirationDateTime)));
    }catch (e){
        console.error(e);
        res.status(500).send(e.message);
    }
});

AuthenticationRouter.post("/logout", (req, res) => {
    try {
        checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER]);
        User.logout(req);
        res.send("Logging out");
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});
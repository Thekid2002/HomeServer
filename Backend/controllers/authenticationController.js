import express from 'express';
import fs from "fs";
import {User} from "../models/user.js";
import {signupUser} from "../services/authenticationService.js";
import {checkEmail, checkPhone, checkString} from "../services/checkService.js";
import {authDto} from "../dto/authDto.js";
import {renderPage} from "../services/pageLayout.js";

export const AuthenticationRouter = express.Router();
export const AuthenticationRoute = 'authentication';

AuthenticationRouter.get("/signup", (req, res) => {
    res.send(renderPage('Backend/views/', "signup"));
});

AuthenticationRouter.get("/login", (req, res) => {
    res.send(renderPage('Backend/views/', "login"));
});

AuthenticationRouter.post("/signup", (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    try{
        checkString(name);
        checkPhone(phone);
        checkEmail(email);
        checkString(password, 8);
        let result = signupUser(name, phone, email, password)
        res.send(result);
    }catch (e){
        console.error(e);
        res.status(500).send(e);
    }
});


AuthenticationRouter.post("/login",  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    console.log("Logging in user: " + email + " with password: " + password);
    try{
        let user = User.validateLogin(email, password)
        res.send(JSON.stringify(new authDto(user.token, user.expirationDateTime)));
    }catch (e){
        console.error(e);
        res.status(500).send(e);
    }
});

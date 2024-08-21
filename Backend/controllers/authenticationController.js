import express from 'express';
import {loginUser, logoutUser, signupUser} from "../services/authenticationService.js";
import {checkEmail, checkPhone, checkString} from "../services/checkService.js";
import {renderPageFromHtmlFile} from "../services/pageLayout.js";
import {checkIsLoggedIn} from "../services/authorizationService.js";

export const AuthenticationRouter = express.Router();
export const AuthenticationRoute = 'authentication';

AuthenticationRouter.get("/signup",  async (req, res) => {
    res.send(await renderPageFromHtmlFile('Backend/views/', "signup", req));
});

AuthenticationRouter.get("/login",  async (req, res) => {
    res.send(await renderPageFromHtmlFile('Backend/views/', "login", req));
});

AuthenticationRouter.post("/signup",  async (req, res) => {
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
        res.send(JSON.stringify(await signupUser(firstname, surname, phone, email, password)));
    }catch (e){
        console.error(e);
        res.status(500).send(e.message);
    }
});


AuthenticationRouter.post("/login",  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Logging in user: " + email);
    try{
        let auth = await loginUser(email, password);
        console.log(auth);
        res.send(JSON.stringify(auth));
    }catch (e){
        console.error(e);
        res.status(500).send(e.message);
    }
});

AuthenticationRouter.post("/logout", async (req, res) => {
    try {
        await checkIsLoggedIn(req.token, req.role, true);
        await logoutUser(req.token);
        res.send("Logging out");
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});
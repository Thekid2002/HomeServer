import express from "express";
import {
    loginUser,
    logoutUser,
    signupUser
} from "../services/authenticationService";
import { checkEmail, checkPhone, checkString } from "../services/checkService";
import { renderPageFromHtmlFile } from "../services/pageLayout";
import { getUserFromRequest } from "../services/authorizationService";
import { User } from "../models/user";

export const AuthenticationRouter = express.Router();
export const AuthenticationRoute = "authentication";

AuthenticationRouter.get("/signup", async (req, res) => {
    res.send(await renderPageFromHtmlFile("Backend/views/", "signup", req));
});

AuthenticationRouter.get("/login", async (req, res) => {
    res.send(await renderPageFromHtmlFile("Backend/views/", "login", req));
});

AuthenticationRouter.post("/signup", async (req, res) => {
    const firstname = req.body.firstname;
    const surname = req.body.surname;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    try {
        checkString(firstname, false, 2, 256);
        checkString(surname, false, 2, 256);
        checkPhone(phone, false);
        checkEmail(email, false);
        checkString(password, false, 8, 256);
        res.send(
            JSON.stringify(
                await signupUser(firstname, surname, phone, email, password)
            )
        );
    } catch (e: any) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

AuthenticationRouter.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("Logging in user: " + email);
    try {
        const auth = await loginUser(email, password);
        console.log(auth);
        res.send(JSON.stringify(auth));
    } catch (e: any) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

AuthenticationRouter.post("/logout", async (req, res) => {
    try {
        const user = await getUserFromRequest(req, true) as User;
        await logoutUser(user);
        res.send("Logging out");
    } catch (e: any) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

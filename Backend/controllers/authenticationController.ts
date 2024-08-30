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
import {sequelize} from "../services/database";

export const AuthenticationRouter = express.Router();
export const AuthenticationRoute = "authentication";

AuthenticationRouter.get("/signup", async (req, res) => {
    res.send(await renderPageFromHtmlFile("Backend/views/", "signup", req));
});

AuthenticationRouter.get("/login", async (req, res) => {
    res.send(await renderPageFromHtmlFile("Backend/views/", "login", req));
});

AuthenticationRouter.post("/signup", async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const firstname = checkString(req.body.firstname, false, 2, 256);
        const surname = checkString(req.body.surname, false, 2, 256);
        const phone = checkPhone(req.body.phone, false);
        const email = checkEmail(req.body.email, false);
        const password = checkString(req.body.password, false, 8, 256)
        await signupUser(firstname, surname, phone, email, password, transaction);
        await transaction.commit();
        res.send(`User ${email} signed up`);
    } catch (e: any) {
        await transaction.rollback();
        console.error(e);
        res.status(500).send(e.message);
    }
});

AuthenticationRouter.post("/login", async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const email = checkEmail(req.body.email, false);
        console.log("Logging in user: " + email);
        const password = checkString(req.body.password, false, 8, 256);
        const auth = await loginUser(email, password, transaction);
        await transaction.commit();
        res.send(JSON.stringify(auth));
    } catch (e: any) {
        console.error(e);
        await transaction.rollback();
        res.status(500).send(e.message);
    }
});

AuthenticationRouter.post("/logout", async (req, res) => {
   const transaction = await sequelize.transaction();
    try {
        const user = await getUserFromRequest(req, true) as User;
        await logoutUser(user, transaction);
        res.send("Logging out");
    } catch (e: any) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

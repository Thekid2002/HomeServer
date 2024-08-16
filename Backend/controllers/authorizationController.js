import express from 'express';
export const AuthorizationRouter = express.Router();
export const AuthorizationRoute = 'authorization';

AuthorizationRouter.get("*", (req, res) => {
    res.send('Hello World!');
});

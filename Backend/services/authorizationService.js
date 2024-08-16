import {User} from "../models/user.js";

export function authorizeToken(req, res, next) {
    if(!req.headers.cookie){
        throw new Error('Cookie is missing');
    }
    let cookies = req.headers.cookie.split(' ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token'));
    if(!tokenCookie){
        throw new Error('Token is missing');
    }
    let token = tokenCookie.split('=')[1];
    if (!token) {
        throw new Error('Token is missing');
    }
    if(!User.validateToken(token)){
        throw new Error('Invalid token');
    }
}
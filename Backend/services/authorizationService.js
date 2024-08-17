import {User} from "../models/user.js";

export function setTokenVariable(req) {
    req.role = null;
    req.token = null;
    if(!req.headers.cookie){
        return;
    }
    let cookies = req.headers.cookie.split(' ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token'));
    if(!tokenCookie){
        return;
    }
    let token = tokenCookie.split('=')[1];
    if (!token) {
        return;
    }
    req.token = token;
    let user = User.validateToken(req.token, false);
    if(!user){
        return;
    }
    req.role = user.role;
}

export function checkIsAuthorizedWithRoles(req, authorizedRoles, throwIfNotAuthorized = true) {
    if(!req.role){
        if (throwIfNotAuthorized) {
            throw new Error('Role is missing');
        }
        return false;
    }
    if(!authorizedRoles){
        if(throwIfNotAuthorized){
            throw new Error('Authorized roles are missing');
        }
        return false;
    }
    if(!authorizedRoles.includes(req.role)){
        if(throwIfNotAuthorized){
            throw new Error('Not authorized');
        }
        return false;
    }
    return true;
}

export function checkIsLoggedIn(req, throwIfNotLoggedIn = true) {
    if(!req?.token){
        if(throwIfNotLoggedIn) {
            throw new Error('Token is missing');
        }
        return false;
    }
    if(req.role === null || req.role === undefined){
        if(throwIfNotLoggedIn){
            throw new Error('Not logged in');
        }
        return false;
    }
    return true;
}
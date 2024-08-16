import {User} from "../models/user.js";

export function signupUser(name, phone, email, password) {
    if (User.userExists(email)) {
        throw new Error('User already exists');
    }
    User.addUser(new User(name, phone, email, password));
    console.log('User created successfully ' + User.getUser(email).toString());
    return 'User created successfully';
}
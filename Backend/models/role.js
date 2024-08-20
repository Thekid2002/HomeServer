import fs from "fs";

export class Role {
    name;
    permissions;

    constructor(name, permissions) {
        this.name = name;
        this.permissions = permissions;
    }
}

export const roleEnum = {
    GUEST: 0,
    SUPER_ADMIN:  1,
    ADMIN: 11,
    USER: 21,
}

export const roleEnumNames = {
    0: "GUEST",
    1: "SUPER ADMIN",
    11: "ADMIN",
    21: "USER",
}
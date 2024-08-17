import fs from "fs";

export class Role {
    name;
    permissions;

    constructor(name, permissions) {
        this.name = name;
        this.permissions = permissions;
    }

    static getAllRoles() {
        this.createFileIfDoesNotExist();
        return JSON.parse(fs.readFileSync("roles.json", "utf8"));
    }

    static getRole(name) {
        this.createFileIfDoesNotExist();
        return this.getAllRoles().find(role => role.name === name);
    }

    static addRole(role) {
        this.createFileIfDoesNotExist();
        let roles = this.getAllRoles();
        roles.push(role);
        Role.saveAllRoles(roles);
    }

    static roleExists(name) {
        this.createFileIfDoesNotExist();
        return this.getAllRoles().some(role => role.name === name);
    }

    static createFileIfDoesNotExist() {
        if (!fs.existsSync("roles.json")) {
            fs.writeFileSync("roles.json", JSON.stringify(defaultRoles));
        }
    }

    static saveAllRoles(roles) {
        fs.writeFileSync("roles.json", JSON.stringify(roles));
    }

    static validateRole(name) {
        this.createFileIfDoesNotExist();
        let role = this.getRole(name);
        if (!role) {
            throw new Error('Invalid role');
        }
        return true;
    }
}

export const roleEnum = {
    GUEST: 0,
    SUPER_ADMIN:  1,
    ADMIN: 11,
    USER: 21,
}

export const defaultRoles = [
    new Role(roleEnum.SUPER_ADMIN, ['create', 'read', 'update', 'delete', 'admin', 'super-admin']),
    new Role(roleEnum.ADMIN, ['create', 'read', 'update', 'delete', 'admin']),
    new Role(roleEnum.USER, ['read'])
];
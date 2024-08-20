import {DataColumnEnum, DataColumnType} from "../models/dataColumnType.js";
import {DataLayout} from "../models/dataLayout.js";
import {Role, roleEnum} from "../models/role.js";

export const getSaveFileLayout = function () {
    return new DataLayout(
        [
            new DataColumnType("name", "Name", true, false),
            new DataColumnType("path", "Path", true, false),
            new DataColumnType("content", "Content", false, false, DataColumnEnum.textArea, null, [roleEnum.SUPER_ADMIN]),
        ]
    );
}

export const getUserLayout = function (role) {
    return new DataLayout(
        [
            new DataColumnType("id", "ID", false, true, DataColumnEnum.value, null, [roleEnum.SUPER_ADMIN]),
            new DataColumnType("firstname", "Firstname", true, false),
            new DataColumnType("surname", "Surname", true, false),
            new DataColumnType("role", "Role", true, false, DataColumnEnum.select, roleEnum, [roleEnum.SUPER_ADMIN]),
            new DataColumnType("email", "Email", true, true),
            new DataColumnType("phone", "Phone", true, false)
        ]
    );
}

export const getRepositoryLayout = function (creating = false) {
    let repoLayout = new DataLayout(
        [
            new DataColumnType("name", "Name", true, false),
            new DataColumnType("description", "Description", true, false)
        ]
    );
    if(creating){
        repoLayout.columns.push(new DataColumnType("userId", "User ID", true, false, DataColumnEnum.value, null, [roleEnum.SUPER_ADMIN]));
    }else {
        repoLayout.columns.push(new DataColumnType("userEmail", "Email User", true, true, DataColumnEnum.value));
        repoLayout.columns.push(new DataColumnType("userId", "User", false, true, DataColumnEnum.value, null, [roleEnum.SUPER_ADMIN]));
        repoLayout.columns.push(new DataColumnType("link", "Open", false, false, DataColumnEnum.link,  null,[roleEnum.SUPER_ADMIN], null, "/repositories/open?id="));
        repoLayout.columns.push(new DataColumnType("saveFiles", "Save Files", false, true, DataColumnEnum.array, null, [roleEnum.SUPER_ADMIN], getSaveFileLayout()));
    }
    return repoLayout;
}
import {DataColumnEnum, DataColumnType} from "../models/dataColumnType.js";
import {DataLayout} from "../models/dataLayout.js";
import {Role, roleEnum} from "../models/role.js";

export const getSaveFileLayout = function (creating = false, repositoryIds = []) {
    let saveFileLayout = new DataLayout([]);
    if(!creating) {
        saveFileLayout.columns.push(new DataColumnType("id", "ID", false, true, DataColumnEnum.value, null, [roleEnum.SUPER_ADMIN]));
    }

    saveFileLayout.columns.push(new DataColumnType("name", "Name", true, false));
    saveFileLayout.columns.push(new DataColumnType("path", "Path", true, false));
    saveFileLayout.columns.push(new DataColumnType("content", "Content", true, false, DataColumnEnum.textArea, null, [roleEnum.SUPER_ADMIN]));
    if(creating) {
        saveFileLayout.columns.push(new DataColumnType("repositoryId", "Repository ID", true, false, DataColumnEnum.selectFromKeyValueArray, repositoryIds));
    }else {
        saveFileLayout.columns.push(new DataColumnType("repositoryId", "Repository ID", false, true, DataColumnEnum.value));
    }
    return saveFileLayout;
}

export const getUserLayout = function (role, creating = false) {
    let userLayout = new DataLayout([]);
    if(!creating) {
        userLayout.columns.push(new DataColumnType("id", "ID", false, true, DataColumnEnum.value, null, [roleEnum.SUPER_ADMIN]));
    }

    userLayout.columns.push(new DataColumnType("firstname", "Firstname", true, false));
    userLayout.columns.push(new DataColumnType("surname", "Surname", true, false));
    userLayout.columns.push(new DataColumnType("phone", "Phone", true, false));
    userLayout.columns.push(new DataColumnType("role", "Role", true, false, DataColumnEnum.selectEnum, roleEnum, [roleEnum.SUPER_ADMIN]));
    userLayout.columns.push(new DataColumnType("email", "Email", true, false));
    if(creating){
        userLayout.columns.push(new DataColumnType("password", "Password", true, false, DataColumnEnum.value, null, [roleEnum.SUPER_ADMIN]));
    }
    return userLayout;

}

export const getRepositoryLayout = function (creating = false, saveFiles = [], userList = []) {
    let repoLayout = new DataLayout([]);

    if(!creating){
        repoLayout.columns.push(new DataColumnType("id", "ID", false, true, DataColumnEnum.value, null, [roleEnum.SUPER_ADMIN]));
    }

    repoLayout.columns.push(new DataColumnType("name", "Name", true, false));
    repoLayout.columns.push(new DataColumnType("description", "Description", true, false));


    if(creating){
        repoLayout.columns.push(new DataColumnType("userId", "User ID", true, false, DataColumnEnum.selectFromKeyValueArray, userList, [roleEnum.SUPER_ADMIN]));
    }else {
        repoLayout.columns.push(new DataColumnType("entryPointFile", "Entry Point File", false, false, DataColumnEnum.selectFromKeyValueArray, saveFiles));
        repoLayout.columns.push(new DataColumnType("runtimeFile", "Runtime File", false, false, DataColumnEnum.selectFromKeyValueArray, saveFiles));
        repoLayout.columns.push(new DataColumnType("runtimeImportFile", "Runtime Import File", false, false, DataColumnEnum.selectFromKeyValueArray, saveFiles));
        repoLayout.columns.push(new DataColumnType("userEmail", "Email User", true, true, DataColumnEnum.value));
        repoLayout.columns.push(new DataColumnType("userId", "User", false, true, DataColumnEnum.value, null, [roleEnum.SUPER_ADMIN]));
        repoLayout.columns.push(new DataColumnType("link", "Open", false, false, DataColumnEnum.link,  null,[roleEnum.SUPER_ADMIN], null, "/repositories/open?id="));
        repoLayout.columns.push(new DataColumnType("saveFiles", "Save Files", false, true, DataColumnEnum.array, null, [roleEnum.SUPER_ADMIN], getSaveFileLayout()));
    }
    return repoLayout;
}
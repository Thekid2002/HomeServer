import { DataColumnEnum, DataColumnType } from "../models/dataColumnType";
import { DataLayout } from "../models/dataLayout";
import { RoleEnum } from "../models/roleEnum";

export const getSaveFileLayout = function (
    creating = false,
    repositoryIds: number[] = []
): DataLayout {
    const saveFileLayout = new DataLayout([]);
    if (!creating) {
        saveFileLayout.columns.push(
            new DataColumnType("id", "ID", false, true, DataColumnEnum.value, null, [
                RoleEnum.SUPER_ADMIN
            ])
        );
    }

    saveFileLayout.columns.push(new DataColumnType("name", "Name", true, false));
    saveFileLayout.columns.push(new DataColumnType("path", "Path", true, false));
    saveFileLayout.columns.push(
        new DataColumnType(
            "content",
            "Content",
            true,
            false,
            DataColumnEnum.textArea,
            null,
            [ RoleEnum.SUPER_ADMIN ]
        )
    );
    if (creating) {
        saveFileLayout.columns.push(
            new DataColumnType(
                "repositoryId",
                "Repository ID",
                true,
                false,
                DataColumnEnum.selectFromKeyValueArray,
                repositoryIds
            )
        );
    } else {
        saveFileLayout.columns.push(
            new DataColumnType(
                "repositoryId",
                "Repository ID",
                false,
                true,
                DataColumnEnum.value
            )
        );
    }
    return saveFileLayout;
};

export const getUserLayout = function (creating = false) {
    const userLayout = new DataLayout([]);
    if (!creating) {
        userLayout.columns.push(
            new DataColumnType("id", "ID", false, true, DataColumnEnum.value, null, [
                RoleEnum.SUPER_ADMIN
            ])
        );
    }

    userLayout.columns.push(
        new DataColumnType("firstname", "Firstname", true, false)
    );
    userLayout.columns.push(
        new DataColumnType("surname", "Surname", true, false)
    );
    userLayout.columns.push(new DataColumnType("phone", "Phone", true, false));
    userLayout.columns.push(
        new DataColumnType(
            "role",
            "Role",
            true,
            false,
            DataColumnEnum.selectEnum,
            turnEnumIntoKeyValueArray(RoleEnum),
            [ RoleEnum.SUPER_ADMIN ]
        )
    );
    userLayout.columns.push(new DataColumnType("email", "Email", true, false));
    if (creating) {
        userLayout.columns.push(
            new DataColumnType(
                "password",
                "Password",
                true,
                false,
                DataColumnEnum.value,
                null,
                [ RoleEnum.SUPER_ADMIN ]
            )
        );
    }
    return userLayout;
};

export const getRepositoryLayout = function (
    creating = false,
    saveFiles: {key: number, value: string}[],
    userList: {key: number, value: string}[]
) {
    const repoLayout = new DataLayout([]);

    if (!creating) {
        repoLayout.columns.push(
            new DataColumnType("id", "ID", false, true, DataColumnEnum.value, null, [
                RoleEnum.SUPER_ADMIN
            ])
        );
    }

    repoLayout.columns.push(new DataColumnType("name", "Name", true, false));
    repoLayout.columns.push(
        new DataColumnType("description", "Description", true, false)
    );

    repoLayout.columns.push(
        new DataColumnType(
            "icon",
            "Icon",
            false,
            false,
            DataColumnEnum.value,
        )
    );

    if (creating) {
        repoLayout.columns.push(
            new DataColumnType(
                "userId",
                "User ID",
                true,
                false,
                DataColumnEnum.selectFromKeyValueArray,
                userList,
                [ RoleEnum.SUPER_ADMIN ]
            )
        );
    } else {
        repoLayout.columns.push(
            new DataColumnType(
                "entryPointFileId",
                "Entry Point File",
                false,
                false,
                DataColumnEnum.selectFromKeyValueArray,
                saveFiles
            )
        );
        repoLayout.columns.push(
            new DataColumnType(
                "runtimeFileId",
                "Runtime File",
                false,
                false,
                DataColumnEnum.selectFromKeyValueArray,
                saveFiles
            )
        );
        repoLayout.columns.push(
            new DataColumnType(
                "runtimeImportFileId",
                "Runtime Import File",
                false,
                false,
                DataColumnEnum.selectFromKeyValueArray,
                saveFiles
            )
        );
        repoLayout.columns.push(
            new DataColumnType(
                "userId",
                "User",
                false,
                true,
                DataColumnEnum.selectFromKeyValueArray,
                userList,
                [ RoleEnum.SUPER_ADMIN ]
            )
        );
        repoLayout.columns.push(
            new DataColumnType(
                "link",
                "Open",
                false,
                false,
                DataColumnEnum.link,
                null,
                [ RoleEnum.SUPER_ADMIN ],
                null,
                "/repositories/open?id="
            )
        );
        repoLayout.columns.push(
            new DataColumnType(
                "saveFiles",
                "Save Files",
                false,
                true,
                DataColumnEnum.array,
                null,
                [ RoleEnum.SUPER_ADMIN ],
                getSaveFileLayout()
            )
        );
    }
    return repoLayout;
};

function turnEnumIntoKeyValueArray(enumObject: any): { key: any; value: any }[] {
    const array = Object.keys(enumObject).map((key) => ({
        key: enumObject[key],
        value: key
    }));
    return array.splice(array.length/2, array.length-1);
}

import fs from "fs";
import {
    checkIsAuthorizedWithRoles
} from "./authorizationService";
import { RoleEnum } from "../models/roleEnum";
import { DataColumnEnum } from "../models/dataColumnType";
import { DataLayout } from "../models/dataLayout";
import { mapDateTimeToIsoString } from "./mapper";
import { Request } from "express";
import { Repository } from "../models/repository";

let header = null;

export async function renderPageFromHtmlFile(
    htmlPath: string,
    pathName: string,
    req: Request
) {
    if (!fs.existsSync(htmlPath + pathName + ".html")) {
        console.error("No file found for: " + pathName);
        return await renderPageFromHtmlFile(htmlPath, "404", req);
    }
    const html = fs.readFileSync(htmlPath + pathName + ".html", "utf8");
    return await renderPageWithBasicLayout(pathName, pathName, html, req);
}

/**
 * Get the header for the page
 * @param req the request
 * @returns {Promise<string>}
 */
async function getHeader(req: Request) {
    header = `  
    <div class="header">
        <div>`;
    if (await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ], false)) {
        header += "<button onclick=\"goToPage('user/allUsers')\">All users</button>";
    }

    if (
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.USER ],
            false
        )
    ) {
        header += "<button onclick=\"goToPage('user/profile')\">Profile</button>";
    }
    header += `</div>

        <div>
            <button onclick="goToPage('carlCompilers/simple')">Simple Calculator</button>
            <button onclick="goToPage('carlInstructions')">Carl Instructions</button>
            <button onclick="goToPage('carlCompilers/ide')">Ide</button>
        </div>
        <div>`;
    if (await checkIsAuthorizedWithRoles(req, [ RoleEnum.SUPER_ADMIN ], false)) {
        header += "<button onclick=\"goToPage('repositories/all')\">All Repositories</button>";
    }
    if (
        await checkIsAuthorizedWithRoles(
            req,
            [ RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.USER ],
            false
        )
    ) {
        header += "<button onclick=\"goToPage('repositories/my')\">Repositories</button>";
        header += "<button onclick=\"logout()\">Logout</button>";
    } else {
        header +=
      "<button onclick=\"goToPage('authentication/login')\">Login</button>" +
      "<button onclick=\"goToPage('authentication/signup')\">Signup</button>";
    }
    header += `
        </div>
    </div>`;
    return header;
}

/**
 * Renders a page with a basic layout
 * @param pageName
 * @param title
 * @param body
 * @param req
 * @param stylesheetPaths
 * @param scriptPaths
 * @returns {Promise<string>}
 */
export async function renderPageWithBasicLayout(
    pageName: string,
    title: string,
    body: string,
    req: Request,
    stylesheetPaths: string[] = [],
    scriptPaths: string[] = []
): Promise<string> {
    stylesheetPaths.push("/styles/header.css");
    stylesheetPaths.push(`/styles/${pageName}.css`);
    scriptPaths.push("/code/header.js");
    scriptPaths.push(`/code/${pageName}.js`);
    let layout =
    "<!DOCTYPE html>" +
    "<html lang=\"en\">" +
    "<head>" +
    "<meta charset=\"UTF-8\">" +
    "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
    `<title>${title}</title>` +
    "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.css\">" +
    "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/theme/darcula.min.css\">" +
    "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">" +
    "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200\">";

    for (const stylesheetPath of stylesheetPaths) {
        layout += `<link rel="stylesheet" href="${stylesheetPath}">`;
    }

    layout +=
    "</head>" + "<body>" + `${await getHeader(req)}` + `${body}` + "</body>";
    for (const scriptPath of scriptPaths) {
        layout += `<script src="${scriptPath}"></script>`;
    }
    layout += "</html>";

    return layout;
}

/**
 * Renders a page with a table
 * @param title
 * @param tableData
 * @param tableLayout
 * @param req
 * @param isEditable
 * @param isDeletable
 * @returns {Promise<string>}
 */
async function renderTablePage(
    title: string,
    tableData: any,
    tableLayout: DataLayout,
    req: Request,
    isEditable = false,
    isDeletable = false
): Promise<string> {
    if (!(tableLayout instanceof DataLayout)) {
        throw new Error("tableLayout must be an instance of DataLayout");
    }
    let body = "<table id=\"table\">";
    body += "<tr>";
    for (let i = 0; i < tableLayout.columns.length; i++) {
        body += `<th>${tableLayout.columns[i].title}</th>`;
    }
    if (isEditable) {
        body += "<th>Edit</th>";
    }
    if (isDeletable) {
        body += "<th>Delete</th>";
    }
    body += "</tr>";
    for (let i = 0; i < tableData?.length; i++) {
        const row = tableData[i];
        body += "<tr>";
        for (let j = 0; j < tableLayout.columns.length; j++) {
            const column = tableLayout.columns[j];
            if (column.type === DataColumnEnum.array) {
                const array = row[column.key];
                let arrayString = "";
                for (let k = 0; k < array.length; k++) {
                    arrayString += array[k].id;
                    if (k < array.length - 1) {
                        arrayString += ", ";
                    }
                }
                body += `<td>${arrayString}</td>`;
            }

            if (column.type === DataColumnEnum.selectFromKeyValueArray || column.type === DataColumnEnum.selectEnum) {
                const match = column.listForSelect!.find(
                    (item) => item.key === row[column.key]
                );
                console.log(column.listForSelect);
                console.log("hej " + column.listForSelect + " " + column.key + " " + row[column.key]);
                if (match) {
                    body += `<td>${match.value}</td>`;
                } else {
                    body += `<td>${column.listForSelect![row[column.key]]}</td>`;
                }
            }

            if (column.type === DataColumnEnum.value) {
                body += `<td>${row[column.key]}</td>`;
            }

            if (column.type === DataColumnEnum.dateTime) {
                body += `<td>${mapDateTimeToIsoString(new Date(row[column.key]))}</td>`;
            }

            if (column.type === DataColumnEnum.boolean) {
                body += `<td>${row[column.key] ? "true" : "false"}</td>`;
            }

            if (column.type === DataColumnEnum.textArea) {
                body += `<td>${row[column.key] ? row[column.key].substring(0, 23) + "..." : "null"}</td>`;
            }

            if (column.type === DataColumnEnum.link) {
                body += `<td><a href="${row[column.key] ? row[column.key] : null}">${column.title}</a></td>`;
            }
        }
        if (isEditable) {
            body += `<td><button type="button" onclick="editObject(${row.id})">Edit</button></td>`;
        }
        if (isDeletable) {
            body += `<td><button type="button" onclick="deleteObject(${row.id})">Delete</button></td>`;
        }
        body += "</tr>";
    }
    body += "</table>";
    body += "<button type=\"button\" onclick=\"createObject()\">Create</button>";
    return body;
}

/**
 * Renders a page with a table
 * @param pageName the name of the page
 * @param title the title of the page
 * @param tableData the data for the table
 * @param tableLayout the layout of the table
 * @param req the request
 * @param isEditable whether the table is editable
 * @param isDeletable whether the table is deletable
 * @returns {Promise<string>}
 */
export async function renderTablePageWithBasicLayout(
    pageName: string,
    title: string,
    tableData: any,
    tableLayout: DataLayout,
    req: Request,
    isEditable = false,
    isDeletable = false
) {
    const body = await renderTablePage(
        title,
        tableData,
        tableLayout,
        req,
        isEditable,
        isDeletable
    );
    return await renderPageWithBasicLayout(pageName, title, body, req, [
        "/styles/table.css"
    ]);
}

/**
 * Renders a page with a form to create or edit an object
 * @param pageName the name of the page
 * @param title the title of the page
 * @param object the object to create or edit
 * @param dataLayout the layout of the form
 * @param req the request
 * @returns {Promise<string>}
 */
export async function renderPageObjectCreateEditPage(
    pageName: string,
    title: string,
    object: any,
    dataLayout: DataLayout,
    req: Request
): Promise<string> {
    if (!(dataLayout instanceof DataLayout)) {
        throw new Error("dataLayout must be an instance of DataLayout");
    }
    let body =
    "<div class=\"form-page-layout\">" + `<h1>${title}</h1>` + "<form id=\"form\">";
    for (let i = 0; i < dataLayout.columns.length; i++) {
        const column = dataLayout.columns[i];
        if (
            column.rolesAllowed !== null &&
      !(await checkIsAuthorizedWithRoles(req, column.rolesAllowed, false))
        ) {
            continue;
        }
        body += "<div>";

        if (column.type === DataColumnEnum.array) {
            const table = await renderTablePage(
                column.title,
                !object ? null : object[column.key],
        column.arrayTableLayout!,
        req,
        true,
        true
            );
            body += table;
        }

        if (column.type === DataColumnEnum.selectFromKeyValueArray || column.type === DataColumnEnum.selectEnum) {
            console.log(column.listForSelect);
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<select id="${column.key}" name="${column.key}" ${column.readonly ? "readonly" : ""}>`;
            if (!column.required) {
                body += "<option value=\"null\">null</option>";
            }
            for (let j = 0; j < column.listForSelect!.length; j++) {
                if (parseInt(!object ? null : object[column.key]) === column.listForSelect![j].key) {
                    body += `<option value="${column.listForSelect![j].key}" selected>${column.listForSelect![j].value}</option>`;
                } else {
                    body += `<option value="${column.listForSelect![j].key}">${column.listForSelect![j].value}</option>`;
                }
            }
            body += "</select><br>";
        }

        if (column.type === DataColumnEnum.value) {
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<input type="text" id="${column.key}" name="${column.key}" placeholder="${column.key}" value="${!object ? "null" : object[column.key]}"  ${column.readonly ? "readonly" : ""}><br>`;
        }

        if (column.type === DataColumnEnum.dateTime) {
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<input type="datetime-local" id="${column.key}" name="${column.key}" value="${!object ? "null" : object[column.key]}" ${column.readonly ? "readonly" : ""}><br>`;
        }

        if (column.type === DataColumnEnum.boolean) {
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<input type="checkbox" id="${column.key}" name="${column.key}" ${!object ? "" : object[column.key] ? "checked" : ""} ${column.readonly ? "readonly" : ""}><br>`;
        }

        if (column.type === DataColumnEnum.textArea) {
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<textarea id="${column.key}" name="${column.key}" placeholder="${column.key}" ${column.readonly ? "readonly" : ""}>${!object ? "null" : object[column.key]}</textarea><br>`;
        }

        if (column.type === DataColumnEnum.link) {
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<a href="${!object ? "null" : object[column.key]}">${column.title}</a><br>`;
        }

        body += "</div>";
    }
    body += "<button type=\"submit\">Submit</button>";
    body += "</form>";
    body += "</div>";
    return await renderPageWithBasicLayout(
        pageName,
        title,
        body,
        req,
        [ "/styles/form.css" ],
        [ "/code/form.js" ]
    );
}

/**
 * Renders a page with an IDE layout
 * @param pageName
 * @param title
 * @param Repository
 * @param req
 * @returns {Promise<string>}
 */
export async function renderIdePageWithBasicLayout(
    pageName: string,
    title: string,
    Repository: Repository,
    req: Request
) {
    let body = `<div class="page">
        <div class="page-layout">
            <div id="file-selector-window" class="file-selector-window">
            `;

    body += `</div>
            <div id="code-editor-window" class="code-editor-window">
                <div class="header-of-editor-window">
                    <div id="pull-code-editor" class="puller">
                        +
                    </div>
                    <div class="compile-buttons">
                        <button onclick="compileAndExecute()" id="compile">Play</button>
                        <button onclick="debug()">Debug</button>
                        <button onclick="saveRepository()">Save</button>
                    </div>
                </div>
                <textarea id="code" class="code-editor" spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"></textarea>
            </div>
            <div id="terminal-window" class="terminal-window">
                <div class="header-of-editor-window">
                    <div id="pull-terminal" class="puller">
                        +
                    </div>
                </div>
                <textarea id="terminal" class="terminal" spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off"></textarea>
            </div>
        </div>
    </div>
    <script type="module">
        import { compileAndExecute } from '/code/carlCompilationHelper.js';
        window.compileAndExecute = compileAndExecute;
    </script>`;
    return await renderPageWithBasicLayout(
        pageName,
        title,
        body,
        req,
        [ "/styles/ide.css" ],
        [
            "/code/ide.js",
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/javascript/javascript.min.js",
            "/code/setupCodeEditors.js",
            "/code/libwabt.js",
            "/code/fileSelector.js"
        ]
    );
}

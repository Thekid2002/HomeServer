import fs from "fs";
import {checkIsAuthorizedWithRoles, checkIsLoggedIn} from "./authorizationService.js";
import {roleEnum} from "../models/role.js";
import {DataColumnEnum} from "../models/dataColumnType.js";
import {DataLayout} from "../models/dataLayout.js";
import {mapDateTimeToIsoString} from "./mapper.js";

let header = null;

export async function renderPageFromHtmlFile(htmlPath, pathName, req){
    if(!fs.existsSync(htmlPath + pathName + ".html")){
        console.error("No file found for: " + pathName);
        return await renderPageFromHtmlFile(htmlPath, "404", req);
    }
    let html = fs.readFileSync(htmlPath + pathName + ".html", 'utf8');
    return await renderPageWithBasicLayout(pathName, pathName, html, req);
}

/**
 * Get the header for the page
 * @param req the request
 * @returns {Promise<string>}
 */
async function getHeader(req){
    header = `  
    <div class="header">
        <div>`;
    if(await checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN], false)) {
        header += `<button onclick="goToPage('user/allUsers')">All users</button>`;
    }

    if(await checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER], false)) {
        header += `<button onclick="goToPage('user/settings')">Settings</button>`;
        header += `<button onclick="goToPage('user/profile')">Profile</button>`;
    }
    header += `</div>

        <div>
            <button onclick="goToPage('carlCompilers/simple')">Simple Calculator</button>
            <button onclick="goToPage('carlCompilers/ide')">IDE</button>
            <button onclick="goToPage('carlInstructions')">Carl Instructions</button>
        </div>
        <div>`;
    if(await checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN], false)) {
        header += `<button onclick="goToPage('repositories/all')">All Repositories</button>`;
    }
    if(await checkIsLoggedIn(req.token, req.role, false)){
        header += `<button onclick="goToPage('repositories/my')">Repositories</button>`;
        header += `<button onclick="logout()">Logout</button>`;
    }else {
        header += `<button onclick="goToPage('authentication/login')">Login</button>` +
            `<button onclick="goToPage('authentication/signup')">Signup</button>`;
    }
    header += `
        </div>
    </div>`
    return header;
}

/**
 * Renders a page with a basic layout
 * @param pageName
 * @param title
 * @param body
 * @param req
 * @param stylesheets
 * @param scripts
 * @returns {Promise<string>}
 */
async function renderPageWithBasicLayout(pageName, title, body, req, stylesheets = [], scripts = []){
    stylesheets.push('/styles/header.css');
    stylesheets.push(`/styles/${pageName}.css`);
    scripts.push('/code/header.js');
    scripts.push(`/code/${pageName}.js`);
    let layout = `<!DOCTYPE html>` +
        `<html lang="en">` +
        `<head>` +
        `<meta charset="UTF-8">` +
        `<meta http-equiv="X-UA-Compatible" content="IE=edge">` +
        `<meta name="viewport" content="width=device-width, initial-scale=1.0">` +
        `<title>${title}</title>`+
        `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.css">` +
        `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/theme/darcula.min.css">`;
    for (let stylesheet of stylesheets){
        layout += `<link rel="stylesheet" href="${stylesheet}">`;
    }

    layout +=`</head>` +
        `<body>` +
        `${await getHeader(req)}` +
        `${body}` +
        `</body>`;
    for (let script of scripts){
        layout += `<script src="${script}"></script>`;
    }
    layout += `</html>`;

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
 async function renderTablePage(title, tableData, tableLayout, req, isEditable = false, isDeletable = false){
    if(!(tableLayout instanceof DataLayout)){
        throw new Error("tableLayout must be an instance of DataLayout");
    }
    let body = '<table id="table">';
    body += '<tr>';
    for (let i = 0; i < tableLayout.columns.length; i++) {
        body += `<th>${tableLayout.columns[i].title}</th>`;
    }
    if(isEditable){
        body += `<th>Edit</th>`;
    }
    if(isDeletable){
        body += `<th>Delete</th>`;
    }
    body += '</tr>';
    for (let i = 0; i < tableData?.length; i++) {
        const row = tableData[i];
        body += '<tr>';
        for (let j = 0; j < tableLayout.columns.length; j++) {
            const column = tableLayout.columns[j];
            if(column.type === DataColumnEnum.array){
                let array = row[column.key];
                let arrayString = '';
                for (let k = 0; k < array.length; k++) {
                    arrayString += array[k].id;
                    if(k < array.length - 1) {
                        arrayString += ', ';
                    }
                }
                body += `<td>${arrayString}</td>`;
            }
            if(column.type === DataColumnEnum.selectEnum){
                let iterableEnum = Object.entries(column.listForSelectEnum).map(([value, key]) => ({key, value}));
                const match = iterableEnum.find(item => parseInt(item.key) === parseInt(row[column.key]));
                if (match) {
                    body += `<td>${match.value}</td>`;
                } else {
                    body += `<td>${row[column.key]}</td>`;
                }
            }

            if(column.type === DataColumnEnum.selectFromKeyValueArray){
                const match = column.listForSelectKeyValueArray.find(item => parseInt(item.key) === parseInt(row[column.key]));
                if (match) {
                    body += `<td>${match.value}</td>`;
                } else {
                    body += `<td>${row[column.key]}</td>`;
                }
            }

            if(column.type === DataColumnEnum.value){
                body += `<td>${row[column.key]}</td>`;
            }

            if(column.type === DataColumnEnum.dateTime){
                body += `<td>${mapDateTimeToIsoString(new Date(row[column.key]))}</td>`;
            }

            if (column.type === DataColumnEnum.boolean) {
                body += `<td>${row[column.key] ? 'true' : 'false'}</td>`;
            }

            if (column.type === DataColumnEnum.textArea) {
                body += `<td>${row[column.key] ?  row[column.key].substring(0, 23) + "..." : "null"}</td>`;
            }

            if(column.type === DataColumnEnum.link){
                body += `<td><a href="${row[column.key] ?  row[column.key] : null}">${column.title}</a></td>`;
            }
        }
        if(isEditable){
            body += `<td><button type="button" onclick="editObject(${row.id})">Edit</button></td>`;
        }
        if(isDeletable){
            body += `<td><button type="button" onclick="deleteObject(${row.id})">Delete</button></td>`;
        }
        body += '</tr>';
    }
    body += '</table>';
    body += `<button type="button" onclick="createObject()">Create</button>`;
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
export async function renderTablePageWithBasicLayout(pageName, title, tableData, tableLayout, req, isEditable = false, isDeletable = false){
    let body = await renderTablePage(title, tableData, tableLayout, req, isEditable, isDeletable);
    return await renderPageWithBasicLayout(pageName, title, body, req, ['/styles/table.css']);
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
export async function renderPageObjectCreateEditPage(pageName, title, object, dataLayout, req){
    if(!(dataLayout instanceof DataLayout)){
        throw new Error("dataLayout must be an instance of DataLayout");
    }
    let body = `<div class="form-page-layout">` +
        `<h1>${title}</h1>` +
        '<form id="form">';
    for (let i = 0; i < dataLayout.columns.length; i++) {
        const column = dataLayout.columns[i];
        if(column.rolesAllowed !== null && !await checkIsAuthorizedWithRoles(req, column.rolesAllowed, false)){
            continue;
        }
        body += `<div>`;

        if(column.type === DataColumnEnum.array){
            let table = await renderTablePage(column.title, !object ? null : object[column.key], column.arrayTableLayout, req, true, true);
            body += table;
        }

        if(column.type === DataColumnEnum.selectEnum){
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<select id="${column.key}" name="${column.key}" ${column.readonly ? "readonly" : ""}>`;
            let iterableEnum = Object.entries(column.listForSelectEnum).map(([value, key]) => ({key, value}));
            console.log(iterableEnum);
            for (let j = 0; j < iterableEnum.length; j++) {
                if(parseInt(!object ? null : object[column.key]) === parseInt(iterableEnum[j].key)){
                    body += `<option value="${iterableEnum[j].key}" selected>${iterableEnum[j].value}</option>`;
                }else {
                    body += `<option value="${iterableEnum[j].key}">${iterableEnum[j].value}</option>`;
                }
            }
            body += `</select><br>`;
        }

        if(column.type === DataColumnEnum.selectFromKeyValueArray){
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<select id="${column.key}" name="${column.key}" ${column.readonly ? "readonly" : ""}>`;
            if(!column.required){
                body += `<option value="null">null</option>`;
            }
            for (let j = 0; j < column.listForSelectKeyValueArray.length; j++) {
                if(parseInt(!object ? null : object[column.key]) === parseInt(column.listForSelectKeyValueArray[j].key)){
                    body += `<option value="${column.listForSelectKeyValueArray[j].key}" selected>${column.listForSelectKeyValueArray[j].value}</option>`;
                }else {
                    body += `<option value="${column.listForSelectKeyValueArray[j].key}">${column.listForSelectKeyValueArray[j].value}</option>`;
                }
            }
            body += `</select><br>`;
        }

        if(column.type === DataColumnEnum.value) {
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<input type="text" id="${column.key}" name="${column.key}" placeholder="${column.key}" value="${!object ? "null" : object[column.key]}"  ${column.readonly ? "readonly" : ""}><br>`;
        }

        if(column.type === DataColumnEnum.dateTime){
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<input type="datetime-local" id="${column.key}" name="${column.key}" value="${!object ? "null" : object[column.key]}" ${column.readonly ? "readonly" : ""}><br>`;
        }

        if(column.type === DataColumnEnum.boolean){
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<input type="checkbox" id="${column.key}" name="${column.key}" ${!object ? "" : object[column.key] ? "checked" : ""} ${column.readonly ? "readonly" : ""}><br>`;
        }

        if(column.type === DataColumnEnum.textArea){
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<textarea id="${column.key}" name="${column.key}" placeholder="${column.key}" ${column.readonly ? "readonly" : ""}>${!object ? "null" : object[column.key]}</textarea><br>`;
        }

        if(column.type === DataColumnEnum.link){
            body += `<label for="${column.key}">${column.title}</label><br>`;
            body += `<a href="${!object ? "null" : object[column.key]}">${column.title}</a><br>`;
        }

        body += `</div>`;
    }
    body += '<button type="submit">Submit</button>';
    body += '</form>';
    body += '</div>';
    return await renderPageWithBasicLayout(pageName, title, body, req, ['/styles/form.css'], ['/code/form.js']);
}

/**
 * Renders a page with an IDE layout
 * @param pageName
 * @param title
 * @param Repository
 * @param req
 * @returns {Promise<string>}
 */
export async function renderIdePageWithBasicLayout(pageName, title, Repository, req){
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
    return await renderPageWithBasicLayout(pageName, title, body, req, ['/styles/ide.css'], [
        '/code/ide.js',
        `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/javascript/javascript.min.js`,
    `/code/setupCodeEditors.js`,
    `/code/libwabt.js`,
    `/code/fileSelector.js`]);
}

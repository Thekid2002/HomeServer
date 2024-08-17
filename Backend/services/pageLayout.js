import fs from "fs";
import {checkIsAuthorizedWithRoles, checkIsLoggedIn} from "./authorizationService.js";
import {roleEnum} from "../models/role.js";

let header = null;

export function renderPageFromHtmlFile(htmlPath, pathName, req){
    if(!fs.existsSync(htmlPath + pathName + ".html")){
        return renderPageFromHtmlFile(htmlPath, "404", req);
    }
    let html = fs.readFileSync(htmlPath + pathName + ".html", 'utf8');
    return renderPageWithBasicLayout(pathName, html, req);
}

function getHeader(req){
    header = `  
    <div class="header">
        <div>` +
            `<button onclick="goToPage('home')">Home</button>
            <button onclick="goToPage('about')">About</button>
            <button onclick="goToPage('contact')">Contact</button>`;
    if(checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN], false)) {
        header += `<button onclick="goToPage('user/allUsers')">All users</button>`;
    }
    console.log(req?.role);
    if(checkIsAuthorizedWithRoles(req, [roleEnum.SUPER_ADMIN, roleEnum.ADMIN, roleEnum.USER], false)) {
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
    if(checkIsLoggedIn(req, false)){
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

function renderPageWithBasicLayout(title, body, req, stylesheets = [], scripts = []){
    stylesheets.push('/styles/header.css');
    stylesheets.push(`/styles/${title}.css`);
    scripts.push('/code/header.js');
    scripts.push(`/code/${title}.js`);
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
        `${getHeader(req)}` +
        `${body}` +
        `</body>`;
    for (let script of scripts){
        layout += `<script src="${script}"></script>`;
    }
    layout += `</html>`;

    return layout;
}

export function renderTablePage(title, tableData, tableHeaders, req){
    let body = '<table id="table">';
    body += '<tr>';
    for (let i = 0; i < tableHeaders.length; i++) {
        body += `<th>${tableHeaders[i]}</th>`;
    }
    body += '</tr>';
    for (let i = 0; i < tableData.length; i++) {
        body += '<tr>';
        for (let j = 0; j < tableHeaders.length; j++) {
            body += `<td>${tableData[i][tableHeaders[j]]}</td>`;
        }
        body += '</tr>';
    }
    return renderPageWithBasicLayout(title, body, req, ['/styles/table.css']);
}

export function renderPageObjectCreateEditPage(title, object, req){

    let body = `<div class="form-page-layout">` +
        `<h1>${title}</h1>` +
        '<form id="form">';
    for (let key in object) {
        body += `<div>`;
        body += `<label for="${key}">${key}</label><br>`;
        body += `<input type="text" id="${key}" name="${key}" placeholder="${key}" value="${object[key]}"><br>`;
        body += `</div>`;
    }
    body += '<button type="submit">Submit</button>';
    body += '</form>';
    body += '</div>';
    return renderPageWithBasicLayout(title, body, req, ['/styles/form.css'], ['/code/form.js']);
}
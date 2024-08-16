import fs from "fs";

let header = null;
export function renderPage(htmlPath, pathName){
    let html = fs.readFileSync(htmlPath + pathName + ".html", 'utf8');
    return getBasicLayout(pathName, ['/styles/header.css', `/styles/${pathName}.css`], [`/code/header.js`, `/code/${pathName}.js`], html);
}

function getHeader(){
    if (header === null){
        header = fs.readFileSync('Backend/views/header.html', 'utf8');
    }
    return header;
}

function getBasicLayout(title, stylesheets, scripts, body){
    let layout = `<!DOCTYPE html>` +
        `<html lang="en">` +
        `<head>` +
        `<meta charset="UTF-8">` +
        `<meta http-equiv="X-UA-Compatible" content="IE=edge">` +
        `<meta name="viewport" content="width=device-width, initial-scale=1.0">` +
        `<title>${title}</title>`;
    for (let stylesheet of stylesheets){
        layout += `<link rel="stylesheet" href="${stylesheet}">`;
    }
    layout +=`</head>` +
        `<body>` +
        `${getHeader()}` +
        `${body}` +
        `</body>`;
    for (let script of scripts){
        layout += `<script src="${script}"></script>`;
    }
    layout += `</html>`;

    return layout;
}
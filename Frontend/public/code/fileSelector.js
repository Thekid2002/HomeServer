
let saveFiles;
async function getSaveFilesForRepository() {
    await fetch("/saveFile/get?repositoryId=" + window.location.href.split("=")[1])
        .then(response => {
            if(response.status === 200) {
                return response.json();
            }
           response.text().then(text => {
               alert(text);
           });
        })
        .then(data => {
            saveFiles = data;
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                window.localStorage.setItem(data[i].id, data[i].content);
                let saveFileElement = document.createElement("button");
                saveFileElement.id = data[i].id;
                saveFileElement.innerHTML = data[i].path;
                saveFileElement.onclick = function () {
                    selectFile(data[i].id);
                }
                document.getElementById("file-selector-window").appendChild(saveFileElement);
            }
        });
}

async function saveRepository() {
    let currentCode = window.codeEditor.getValue();
    if (window.selectedFile) {
        window.localStorage.setItem(window.selectedFile, currentCode);
    }
    let body = [];

    for (let i = 0; i < saveFiles.length; i++) {
        body.push({id: saveFiles[i].id, content: window.localStorage.getItem(saveFiles[i].id)});
    }

    await fetch("/repositories/save?repositoryId=" + window.location.href.split("=")[1], {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => {
        if(response.status === 200) {
            alert("Repository saved successfully");
        } else {
            response.text().then(text => {
                alert(text);
            });
        }
    });
}

function selectFile(fileId) {
    let currentCode = window.codeEditor.getValue();
    if (window.selectedFile) {
        window.localStorage.setItem(window.selectedFile, currentCode);
    }
    let code = window.localStorage.getItem(fileId);
    if(!code){
        code = "";
    }
    window.codeEditor.setValue(code);

    window.selectedFile = fileId;
}

async function init(){
    await getSaveFilesForRepository();
    selectFile(saveFiles[0].id);
}


window.document.onload = init();
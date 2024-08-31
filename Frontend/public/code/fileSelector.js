async function getSaveFilesForRepository() {
    window.localStorage.clear();
    await fetch(
        "/saveFile/get?repositoryId=" + window.location.href.split("=")[1]
    )
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            response.text().then((text) => {
                alert(text);
            });
        })
        .then((data) => {
            let repoId = window.location.href.split("=")[1];
            console.log(data);
            setSaveFilesFromData(data);
        });
}

async function setSaveFilesFromData(data) {
    let saveFilesIdsAndPaths = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].isEntryPointFile) {
            window.localStorage.setItem("entry", data[i].id);
        }
        if (data[i].isRuntimeFile) {
            window.localStorage.setItem("runtime", data[i].id);
        }
        if (data[i].isRuntimeImportFile) {
            window.localStorage.setItem("runtimeImport", data[i].id);
        }
        window.localStorage.setItem(data[i].id, data[i].content);
        saveFilesIdsAndPaths.push({
            id: data[i].id, path: data[i].path});
    }
    let repoId = window.location.href.split("=")[1];
    document.cookie = `repoId=${repoId}; expires=${new Date(Date.now() + 86400000).toUTCString()}; domain=; path=/;`;
    document.cookie = `repo=${JSON.stringify(saveFilesIdsAndPaths)}; expires=${new Date(Date.now() + 86400000).toUTCString()}; domain=; path=/;`;
    await printSaveFiles();
}

async function printSaveFiles() {
    let data = JSON.parse(document.cookie.split("repo=")[1].split(";")[0]);
    for (let i = 0; i < data.length; i++) {
        let saveFileElement = document.createElement("button");
        saveFileElement.id = data[i].id;
        saveFileElement.innerHTML = data[i].path;
        saveFileElement.onclick = function () {
            selectFile(data[i].id);
        };
        document
            .getElementById("file-selector-window")
            .appendChild(saveFileElement);
    }
    selectFile(data[0].id);
}

async function saveRepository() {
    let saveFilesIdsAndPaths = JSON.parse(document.cookie.split("repo=")[1].split(";")[0]);
    let currentCode = window.codeEditor.getValue();
    if (window.selectedFile) {
        window.localStorage.setItem(window.selectedFile, currentCode);
    }
    let body = [];

    for (let i = 0; i < saveFilesIdsAndPaths.length; i++) {
        body.push({
            id: saveFilesIdsAndPaths[i].id,
            content: window.localStorage.getItem(saveFilesIdsAndPaths[i].id)
        });
    }

    await fetch(
        "/repositories/save?repositoryId=" + window.location.href.split("=")[1],
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    ).then((response) => {
        if (response.status === 200) {
            document.cookie = `repoId=; expires=${new Date(Date.now()-1000).toUTCString()}; domain=; path=/`;
            document.cookie = `repo=; expires=${new Date(Date.now()-1000).toUTCString()}; domain=; path=/`;
            alert("Repository saved successfully");
            window.location.href = `/carlCompilers/ide`;
        } else {
            response.text().then((text) => {
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
    if (!code) {
        code = "";
    }
    window.codeEditor.setValue(code);

    window.selectedFile = fileId;
}

async function init() {
    let repoId = null;
    if(document.cookie.indexOf("repoId") !== -1) {
        repoId = document.cookie.split("repoId=")[1].split(";")[0];
    }
    let currentRepoId = window.location.href.split("=")[1];

    if(document.cookie.indexOf("repo") !== -1) {
        if(repoId === currentRepoId) {
            await printSaveFiles()
        }else {
            let overwriteRepo = confirm("You are about to overwrite the current repository. Do you want to continue?");
            if(overwriteRepo) {
                await getSaveFilesForRepository();
            }else {
                window.location.href = `/carlCompilers/ide`;
            }
        }
    }else {
        await getSaveFilesForRepository();
    }
}

window.document.onload = init();

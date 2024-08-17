let runtimeElement = document.getElementById("CarlRuntime");
let editorElement = document.getElementById("CarlEditor");
let runtimeImportElement = document.getElementById("CarlRuntimeImport");

export function selectFile(fileName, codeEditor) {
    let currentCode = codeEditor.getValue();
    if (window.selectedFile) {
        window.localStorage.setItem(window.selectedFile, currentCode);
    }
    let code = window.localStorage.getItem(fileName);
    codeEditor.setValue(code);

    runtimeElement.classList.toggle("active", fileName === "CarlRuntime");
    editorElement.classList.toggle("active", fileName === "CarlEditor");
    runtimeImportElement.classList.toggle("active", fileName === "CarlRuntimeImport");

    window.selectedFile = fileName;
}

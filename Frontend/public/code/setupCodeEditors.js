const codeTextarea = document.getElementById('code');
const codeEditor = CodeMirror.fromTextArea(codeTextarea, {
    lineNumbers: true,
    mode: 'javascript', // Set mode according to the language you're editing
    theme: 'default', // Set the theme to Darcula
});

window.codeEditor = codeEditor;

const terminal = CodeMirror.fromTextArea(document.getElementById('terminal'), {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'default',
    readOnly: true,
});

window.terminal = terminal;

terminal.on('change', () => {
    setTimeout(() => {
        terminal.scrollTo(null, terminal.getScrollInfo().height);
    }, 10);
});

codeEditor.on('change', () => {
    setTimeout(() => {
        window.localStorage.setItem(window.selectedFile, codeEditor.getValue());
    }, 100);
});

const terminalWindow = document.getElementById("terminal-window");
let terminalResizer = document.getElementById('pull-terminal');

const codeEditorWindow = document.getElementById("code-editor-window");
let codeEditorResizer = document.getElementById('pull-code-editor');

let originalSize = 0;
let originalCoordinate = 250;

terminalResizer.addEventListener('mousedown', startResizeHeight);
terminalResizer.addEventListener('touchstart', startResizeHeight);

codeEditorResizer.addEventListener('mousedown', startResizeWidth);
codeEditorResizer.addEventListener('touchstart', startResizeWidth);


function startResizeHeight(e) {
    e.preventDefault();
    originalSize = parseFloat(getComputedStyle(terminalWindow, null).getPropertyValue('height').replace('px', ''));
    originalCoordinate = e.pageY || e.touches[0].pageY;
    window.addEventListener('mousemove', resizeHeight);
    window.addEventListener('touchmove', resizeHeight);
    window.addEventListener('mouseup', stopResize);
    window.addEventListener('touchend', stopResize);
}

function startResizeWidth(e) {
    e.preventDefault();
    originalSize = parseFloat(getComputedStyle(codeEditorWindow, null).getPropertyValue('width').replace('px', ''));
    originalCoordinate = e.pageX || e.touches[0].pageX;
    window.addEventListener('mousemove', resizeWidth);
    window.addEventListener('touchmove', resizeWidth);
    window.addEventListener('mouseup', stopResize);
    window.addEventListener('touchend', stopResize);
}

function resizeHeight(e) {
    const newSize = originalSize - ((e.pageY || e.touches[0].pageY) - originalCoordinate);
    terminalWindow.style.height = `${newSize}px`;
    codeEditorWindow.style.height = `${window.innerHeight - 50 - newSize}px`;
}

function resizeWidth(e) {
    const newSize = originalSize - ((e.pageX || e.touches[0].pageX) - originalCoordinate);
    codeEditorWindow.style.width = `${newSize}px`;
}

function stopResize() {
    window.removeEventListener('mousemove', resizeHeight);
    window.removeEventListener('touchmove', resizeHeight);
    window.removeEventListener('mousemove', resizeWidth);
    window.removeEventListener('touchmove', resizeWidth);
    window.removeEventListener('mouseup', stopResize);
    window.removeEventListener('touchend', stopResize);
}

resizeHeight({pageY: 1});
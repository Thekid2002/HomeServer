import fs from "fs";


let defaultLayout = `<a href="/files.html">Back</a><div style="display: flex; justify-content: center; align-items: center">alsdbsadksad</div>`;

export function displayVideo(fileName) {
    return defaultLayout.replace('alsdbsadksad', `
    <video style="width: 70%; height: 90vh"  controls>
        <source src="/documents/${fileName}" type="video/mp4">
        Your browser does not support the video tag.
    </video>`);
}

export function displayAudio(fileName) {
    return defaultLayout.replace('alsdbsadksad', `
    <audio controls>
        <source src="/documents/${fileName}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>`);
}

export function displayPdf(fileName) {
    return defaultLayout.replace('alsdbsadksad', `
    <embed src="/documents/${fileName}" height="700px" width="1000px" style="width: 50% height: 70vh" />`);
}


export function displayImage(fileName) {
return defaultLayout.replace('alsdbsadksad', `
    <img src="/documents/${fileName}" alt="${fileName}" style="width:50%;">`);
}

export function getFiles(directoryPath, res) {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return res.send('Unable to scan directory: ' + err);
        }

        res.send( files.map(file => `
                <div>
                    <a href="/files/${file}">${file}</a>
                    <button onclick="deleteFile('${file}')">Delete</button>
                </div>
            `).join(""));
    });
}

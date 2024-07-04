import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {displayAudio, displayImage, displayPdf, displayVideo} from "./fileSystem.js";
import {File} from "./class/File.js";
import ffmpeg from "fluent-ffmpeg";
import mime from "mime";

const app = express()
const port = 3000
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Frontend/public/documents')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

app.use(express.static('Frontend/public'))

app.post('/upload', upload.single('myFile'), (req, res) => {
    // req.file is the `myFile` file
    // req.body will hold the text fields, if there were any
    console.log(req.file);
    res.send('File uploaded successfully');
});

app.get('/', (req, res) => {
    res.redirect( '/index.html')
})


app.get('/files', async (req, res) => {
    const directoryPath = path.resolve('Frontend/public/documents');

    fs.readdir(directoryPath, async function (err, files) {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }

        const fileDetails = await Promise.all(files.map(async (file) => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);
            const mimeType = mime.getType(filePath);
            let duration = 0;

            if (mimeType && mimeType.startsWith('video')) {
                duration = await getVideoDuration(filePath);
            }

            return new File(file, mimeType, stats.size, duration);
        }));

        res.json(fileDetails);
    });
});

function getVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
}

app.delete('/files/:name', (req, res) => {
    let fileName = req.params.name;
    let filePath = path.resolve('Frontend/public/documents', fileName);

    fs.unlink(filePath, function (err) {
        if (err) {
            console.log('Error', err);
            res.status(500).send('Unable to delete file: ' + err);
        } else {
            res.send('File deleted successfully');
        }
    });
});

app.get('/files/:name', (req, res) => {
    let fileName = req.params.name;
    let filePath = path.resolve('Frontend/public/documents', fileName);

    if(fileName.toLowerCase().includes('.mov') || fileName.includes('.mp4')) {
        return res.send(displayVideo(fileName));
    }

    if(fileName.toLowerCase().includes('.mp3')) {
        return res.send(displayAudio(fileName));
    }

    if(fileName.toLowerCase().includes('.pdf')) {
        return res.send(displayPdf(fileName));
    }

    if(fileName.toLowerCase().includes('.jpg') || fileName.toLowerCase().includes('.jpeg') || fileName.toLowerCase().includes('.png') || fileName.toLowerCase().includes('.heic')) {
        return res.send(displayImage(fileName));
    }

    res.sendFile(filePath, function (err) {
        if (err) {
            console.log('Error', err);
            res.status(err.status).end();
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}!`)
})

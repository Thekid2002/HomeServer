import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {displayAudio, displayImage, displayPdf, displayVideo, getFiles} from "./fileSystem.js";

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


app.get('/files', (req, res) => {
    const directoryPath = path.resolve('Frontend/public/documents');

    getFiles(directoryPath, res);
});

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

    if(fileName.includes('.mov') || fileName.includes('.mp4')) {
        return res.send(displayVideo(fileName));
    }

    if(fileName.includes('.mp3')) {
        return res.send(displayAudio(fileName));
    }

    if(fileName.includes('.pdf')) {
        return res.send(displayPdf(fileName));
    }

    if(fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png')) {
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

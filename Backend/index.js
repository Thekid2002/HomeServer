import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {displayAudio, displayImage, displayPdf, displayVideo} from "./fileSystem.js";
import {File} from "./class/File.js";
import ffmpeg from "fluent-ffmpeg";
import mime from "mime";
import {AuthenticationRoute, AuthenticationRouter} from "./controllers/authenticationController.js";
import {AuthorizationRoute, AuthorizationRouter} from "./controllers/authorizationController.js";
import {authorizeToken} from "./services/authorizationService.js";
import {CarlInstructionsRoute, CarlInstructionsRouter} from "./controllers/carlInstructionsController.js";
import {renderPage} from "./services/pageLayout.js";
import {NotFoundRoute} from "./controllers/404Controller.js";
import {CarlCompilersRoute, CarlCompilersRouter} from "./controllers/carlCompilersController.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace("/Backend", "");

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});


app.get('/', (req, res) => {
    res.redirect(`/${CarlInstructionsRoute}`)
});
app.use(`/${CarlInstructionsRoute}`, CarlInstructionsRouter);
app.use(`/${AuthenticationRoute}`, AuthenticationRouter);

app.get(`/404`, (req, res) => {
    res.send(renderPage("Backend/views/", "404"));
});

app.use('*', (req, res, next) => {
    let fileName = __dirname + path.join('/Frontend/public', req.baseUrl);
    try{
        fs.accessSync(fileName, fs.constants.F_OK);
        res.sendFile(fileName);
    }catch (e) {
        console.error("File not found: " + fileName);
        next();
    }
}
);
app.use((req, res, next) => {
    try {
        authorizeToken(req, res);
        next();
    } catch (e) {
        //res.status(500).redirect(`/${AuthenticationRoute}/login`);
        res.send("You are not authorized to view this page. Please log in.");
    }
});
app.use(`/${AuthorizationRoute}`, AuthorizationRouter);
app.use(`/${CarlCompilersRoute}`, CarlCompilersRouter);

const upload = multer({storage: storage})

export const SecureFilePath = 'Frontend/public';

app.use((req, res, next) => {
    const filePath = path.join(SecureFilePath, req.path);
    try {
        fs.accessSync(filePath, fs.constants.F_OK)
        next();
    }catch (e) {
        res.redirect(`/404`);
    }
});

app.post('/upload', upload.single('myFile'), (req, res) => {
    // req.file is the `myFile` file
    // req.body will hold the text fields, if there were any
    console.log(req.file);
    res.send('File uploaded successfully');
});

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

    if (fileName.toLowerCase().includes('.mov') || fileName.includes('.mp4')) {
        return res.send(displayVideo(fileName));
    }

    if (fileName.toLowerCase().includes('.mp3')) {
        return res.send(displayAudio(fileName));
    }

    if (fileName.toLowerCase().includes('.pdf')) {
        return res.send(displayPdf(fileName));
    }

    if (fileName.toLowerCase().includes('.jpg') || fileName.toLowerCase().includes('.jpeg') || fileName.toLowerCase().includes('.png') || fileName.toLowerCase().includes('.heic')) {
        return res.send(displayImage(fileName));
    }

    res.sendFile(filePath, function (err) {
        if (err) {
            console.log('Error', err);
            res.status(err.status).end();
        }
    });
});

app.get(`/404`, (req, res) => {
    res.send(renderPage("Backend/views/", NotFoundRoute));
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}!`)
})

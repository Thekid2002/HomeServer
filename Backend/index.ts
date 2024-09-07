import express from "express";
import path from "path";
import fs from "fs";
import {
    AuthenticationRoute,
    AuthenticationRouter
} from "./controllers/authenticationController";
import {
    AuthorizationRoute,
    AuthorizationRouter
} from "./controllers/authorizationController";
import {
    CarlInstructionsRoute,
    CarlInstructionsRouter
} from "./controllers/carlInstructionsController";
import { renderPageFromHtmlFile } from "./services/pageLayout";
import {
    CarlCompilersRoute,
    CarlCompilersRouter
} from "./controllers/carlCompilersController";
import { UserController, UserRoute } from "./controllers/userController";
import {
    RepositoriesRoute,
    RepositoriesRouter
} from "./controllers/repositoriesController";
import {
    SaveFileRoute,
    SaveFileRouter
} from "./controllers/saveFileController";
import * as http from "node:http";
import {PagesRoute, PagesRouter} from "./controllers/pagescontroller";

__dirname = path
    .dirname(__filename)
    .replace("/Backend", "").replace("/dist", "").replace("\\dist", "")
    .replace("\\Backend", "");

export const app = express();
const hostname = "localhost";
const port = 4200;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("*", async (req, res, next) => {
    console.log(req.method + " " + req.baseUrl);
    next();
});

app.get("/", (req, res) => {
    res.redirect(`/${CarlInstructionsRoute}`);
});

app.get("/200", (req, res) => {
    res.send(renderPageFromHtmlFile("Backend/views/", "200", req));
});

app.get("/401", (req, res) => {
    res.send(renderPageFromHtmlFile("Backend/views/", "401", req));
});

app.get("/404", (req, res) => {
    res.send(renderPageFromHtmlFile("Backend/views/", "404", req));
});

app.get("/500", (req, res) => {
    res.send(renderPageFromHtmlFile("Backend/views/", "500", req));
});

app.use(`/${CarlInstructionsRoute}`, CarlInstructionsRouter);
app.use(`/${RepositoriesRoute}`, RepositoriesRouter);
app.use(`/${AuthenticationRoute}`, AuthenticationRouter);
app.use(`/${AuthorizationRoute}`, AuthorizationRouter);
app.use(`/${CarlCompilersRoute}`, CarlCompilersRouter);
app.use(`/${UserRoute}`, UserController);
app.use(`/${SaveFileRoute}`, SaveFileRouter);
app.use(`/${PagesRoute}`, PagesRouter)

app.use("*", async (req, res, next) => {
    if (req.method !== "GET") {
        console.error("Endpoint: " + req.baseUrl + " not found");
        return res.status(404).send("Endpoint: " + req.baseUrl + " not found");
    }

    const fileName = __dirname + path.join("/Frontend/public", req.baseUrl);
    const mimeType = await checkMimeType(fileName);
    try {
        if (mimeType === "text/html" || mimeType === "") {
            return res.send(
                await renderPageFromHtmlFile("Backend/views/", "404", req)
            );
        }
        fs.accessSync(fileName, fs.constants.F_OK);
        return res.sendFile(fileName);
    } catch (e) {
        console.error(e);
        res.status(404).send("SaveFile not found");
    }
});

async function checkMimeType(baseUrl: string): Promise<string> {
    let mimeType = "";
    if (baseUrl.toLowerCase().includes(".html")) {
        mimeType = "text/html";
    } else if (
        baseUrl.toLowerCase().includes(".mov") ||
    baseUrl.includes(".mp4")
    ) {
        mimeType = "video/mp4";
    } else if (baseUrl.toLowerCase().includes(".mp3")) {
        mimeType = "audio/mp3";
    } else if (baseUrl.toLowerCase().includes(".pdf")) {
        mimeType = "application/pdf";
    } else if (baseUrl.toLowerCase().includes(".txt")) {
        mimeType = "text/plain";
    } else if (baseUrl.toLowerCase().includes(".css")) {
        mimeType = "text/css";
    } else if (baseUrl.toLowerCase().includes(".js")) {
        mimeType = "text/javascript";
    } else if (baseUrl.toLowerCase().includes(".wasm")) {
        mimeType = "application/wasm";
    } else if (baseUrl.toLowerCase().includes(".json")) {
        mimeType = "application/json";
    } else if (baseUrl.toLowerCase().includes(".wat")) {
        mimeType = "text/plain";
    } else if (
        baseUrl.toLowerCase().includes(".jpg") ||
    baseUrl.toLowerCase().includes(".jpeg") ||
    baseUrl.toLowerCase().includes(".png") ||
    baseUrl.toLowerCase().includes(".heic")
    ) {
        mimeType = "image/jpeg";
    }

    return mimeType;
}

// Load SSL certificate and key
/**let options = {
    key: fs.readFileSync(__dirname + '/private-key.pem'),
    cert: fs.readFileSync(__dirname + '/csr.pem')
};

// Create an HTTPS server
https.createServer(options, app).listen(443, hostname, () => {
    console.log(`HTTPS Server running at https://${hostname}:443/`);
});*/

// Create an HTTP server
http.createServer(app).listen(port, hostname, () => {
    console.log(`HTTP Server running at http://${hostname}:${port}/`);
});

/**const upload = multer({storage: storage})

app.post('/upload', upload.single('myFile'), (req, res) => {
    // req.file is the `myFile` file
    // req.body will hold the text fields, if there were any
    console.log(req.file);
    res.send('SaveFile uploaded successfully');
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

            return new SaveFile(file, mimeType, stats.size, duration);
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
            res.send('SaveFile deleted successfully');
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
});*/

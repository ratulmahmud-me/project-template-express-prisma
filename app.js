import 'dotenv/config'
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import { AccessForbidden, handleError } from './src/middlewares/handleError.js';
import { errorLogger } from './src/middlewares/handleLogger.js';
import { handleRequest } from './src/middlewares/handleRequest.js';
import routes from './src/routes/index.js';

const app = express();

app.use(express.json());

const allowList = ['http://localhost:3000', 'http://localhost:3001'];

const corsOptions = (origin, callback) => {
    console.log(origin);
    if (allowList.indexOf(origin) !== -1) {
        callback(null, { origin: true });
    } else {
        callback(new AccessForbidden('Not allowed by CORS'));
    }
};
app.use(
    cors(
        // corsOptions
        {
            credentials: true,
            origin: allowList
        }
    )
);

app.use(handleRequest);

app.use("/uploads", express.static('uploads'));

// use app router here under
app.use(routes);

app.use(errorLogger);

app.use(handleError);

const startServer = async (mode = process.env.ENVIRONMENT) => {
    let SSLDIR, PORT, HOST, server, protocol;

    switch (mode) {
        case 'dev':
            SSLDIR = '';
            PORT = process.env.PORT_DEV;
            HOST = process.env.HOST_DEV;
            protocol = 'https';
            break;
        case 'prod':
            SSLDIR = '';
            PORT = process.env.PORT_PROD;
            HOST = process.env.HOST_PROD;
            protocol = 'https';
            break;
        default:
            PORT = process.env.PORT_LOCAL;
            HOST = process.env.HOST_LOCAL;
            protocol = 'http';
            break;
    }

    if (mode === 'local') {
        server = http.createServer(app);
    } else {
        server = https.createServer(
            // {
            //     key: fs.readFileSync(`${SSLDIR}/server.key`),
            //     cert: fs.readFileSync(`${SSLDIR}/server.crt`),
            // },
            app
        );
    }

    server.listen(PORT, () => {
        console.log(`Server is listening at ${protocol}://${HOST}:${PORT}/api ⚡⚡`);
    })
};

startServer();
import winston from "winston";
import expressWinston from "express-winston";
import winstonDaily from "winston-daily-rotate-file";

var fileErrorTransport = new winstonDaily({
    filename: 'log/application-error-%DATE%.log',
    datePattern: 'YYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

export const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console(),
        fileErrorTransport
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    mata: true,
    msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error" : "{{err.message}}" }',
    correlationId: "{{req.headers['x-correlation-id']}}"
});
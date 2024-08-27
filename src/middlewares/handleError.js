import { MulterError } from "multer";
import { deleteUploadedFiles } from "./deleteFiles.js";

export const handleError = async (err, req, res, next) => {
    let code = 500;
    if (err instanceof GeneralError) {
        code = err.getCode();
    }
    else if (err instanceof MulterError) {
        code = 422;
    }

    // check if any file has been uploaded 
    try {
        if (req.file) {
            await deleteUploadedFiles(req?.file?.path);
        }
        else if (req.files) {
            req?.files.forEach(async (element) => {
                await deleteUploadedFiles(element.path);
            })
        }
    } catch (error) {
        console.log(error);
    }

    let correlationId = req.headers['x-correlation-id'];
    return res.status(code).json({
        correlationId: correlationId,
        status: code,
        name: code == 500 ? 'Internal Server Error' : err.name,
        message: code == 500 ? 'Opps! Something went wrong. We will fix this soon...' : err.message
    });
}

export class GeneralError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }

    getCode() { return 400; }
}

export class BadRequest extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }
    getCode() { return 400; }
}

export class Unauthorized extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'Unauthorized';
    }
    getCode() { return 401; }
}

export class UnprocessableEntity extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'UnprocessableEntity';
    }
    getCode() { return 422; }
}

export class NotFound extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }
    getCode() { return 404; }
}

export class AccessForbidden extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'AccessForbidden';
    }
    getCode() { return 403; }
}

export class DuplicateRecord extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'Duplicate Record';
    }
    getCode() { return 409; }
}
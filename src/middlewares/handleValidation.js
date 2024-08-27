import { UnprocessableEntity } from "./handleError.js";

export const handleValidation = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body);
        const isValid = result.error == null
        if (isValid) {
            return next();
        }
        const { details } = result.error;
        const message = details.map((e) => e.message);
        const msg = message.join(',');
        throw new UnprocessableEntity(msg);
    }
}
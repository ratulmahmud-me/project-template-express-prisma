import axios from "axios";
import { AccessForbidden } from "./handleError.js";

export const handleAuth = async (req, res, next) => {

    if (req.headers['sessionid'] && req.headers['authorization']) {
        let sessionID = req.headers['sessionid'];
        let token = req.headers['authorization'];
        token = token.split(" ")[1];

        var data = {
            sessionId: sessionID,
            accessToken: token
        };
        // API for session verification 
        axios.post((process.env.ENVIRONMENT === 'prod' ? process.env.AUTH_URL_PROD : process.env.AUTH_URL_DEV) + '/session/validation', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // console.log("Success Log ============>>", response.data);
                // check if uuid is given 
                // if (req.headers['uuid']) {
                //     getJWTTokenValue(req.headers['rxtoken']);
                // }
                return next();
            })
            .catch(function (error) {
                if (error.response) {
                    // console.log("Error Data===>> " + error.response.data.message);
                    // console.log("Error Status===>> " + error.response.status);
                    return res.status(error.response.status).json(error.response.data);
                }
                return next(error, req, res);
            });

    }
    else {
        try {
            throw new AccessForbidden("Unauthrized access!");
        } catch (error) {
            return next(error, req, res);
        }
    }
}
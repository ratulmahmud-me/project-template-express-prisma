import { Unauthorized } from "../handleError.js";

const secret = "~hello_doer-digital-#A-26-cd@(!)rX$";

export const setJWTToken = (user) => {
    return jwt.sign({
        id: user.id,
        uuid: user.uuid,
        entity_id: user?.entity_id,
        branch_id: user?.branch_id,
        username: user?.username,
        usertype: user?.usertype
    }, secret, {
        expiresIn: '5h'
    });
}

export const getJWTTokenValue = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Unauthorized(error.message);
    }
}

export const decodeJWTWithoutSecret = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return error;
    }
}

export const getUserInfoHeader = (req) => {
    if (req?.headers['rxtoken']) {
        return getJWTTokenValue(req.headers['rxtoken']);
    }
    else {
        console.log("No rxtoken found!");
        throw new Unauthorized("Unauthorized access!");
    }
}

export const exclude = (myobject, keys) => {
    if (Array.isArray(myobject)) {
        return myobject.map((obj) => {
            return _.omit(obj, keys);
        });
    }
    return Object.fromEntries(
        Object.entries(myobject).filter(([key]) => !keys.includes(key))
    );
}
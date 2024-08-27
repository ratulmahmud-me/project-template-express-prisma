import { Router } from "express";
import { login, } from "../controllers/user/user-controller.js";
import validators from "../models/request-model/index.js";

const router = Router();

router.post("/login",
    // handleValidation(validators.userSchemaValidate.authSchema), 
    login);

export default router;
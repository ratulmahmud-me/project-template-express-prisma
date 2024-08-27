import { Router } from "express";
import UserRoutes from './user-routes.js';

const router = Router();

router.use('api/user', UserRoutes)

export default router;
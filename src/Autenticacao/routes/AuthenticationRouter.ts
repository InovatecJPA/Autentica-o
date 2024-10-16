import authenticationController from "../controllers/authenticationController";
const authController = authenticationController;

import { Router } from "express";
const router = Router()    

router.post('/', authController.createAuthentication.bind(authController));
router.post('/login', authController.authenticate.bind(authController));

export default router
import authenticationController from "../controllers/authenticationController";
const controller = authenticationController;

import { Router } from "express";
const routers = Router()    

routers.get('/', controller.authenticate);
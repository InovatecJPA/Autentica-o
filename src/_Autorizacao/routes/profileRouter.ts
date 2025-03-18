import { Router } from 'express';
import { authenticate } from "../../_Autenticacao/middlewares/authenticate.js";
import { IHttpRequest, IHttpResponse, IHttpNext } from "../../interfaces/httpInterface.js";
import profileController from "../controllers/profileController.js";
import authorize from "../middlewares/authorize.js";

/**
 * Definindo as rotas para o ProfileRouter
 */
const profileRouter = Router();

profileRouter.use(authenticate, authorize);

profileRouter.get('/list', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
    profileController.findAll(req, res, next);
});

profileRouter.get('/:id', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
    profileController.findById(req, res, next);
});

profileRouter.get('/:id/authentications', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
    profileController.getAuthenticationsByProfileId(req, res, next);
});

profileRouter.post('/create', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
    profileController.createProfile(req, res, next);
});

profileRouter.put('/:id', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
    profileController.updateProfile(req, res, next);
});


profileRouter.put('/:authId/add-profiles', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
    profileController.addProfilesToAuthentication(req, res, next);
});

profileRouter.put('/:authId/remove-profiles', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
    profileController.removeProfilesFromAuthentication(req, res, next);
});

profileRouter.delete('/:id', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
    profileController.deleteProfile(req, res, next);
});

export default profileRouter;

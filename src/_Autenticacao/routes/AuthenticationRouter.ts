// src/routes/authenticationRouter.ts
import express from 'express';
import authorize from '../../_Autorizacao/middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';
import AuthenticationController from '../controllers/authenticationController.js';
import { IHttpAuthenticatedRequest, IHttpNext, IHttpRequest, IHttpResponse } from '../../interfaces/httpInterface.js';

const authController = AuthenticationController.getInstance();

const router = express.Router();

// --- GET Routes ---

router.get('/list', authenticate, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.findAll(req, res, next);
});


router.get('/me', authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.findMe(req, res, next);
});

router.get('/externals/:id', authenticate, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.findAllByAuthenticationId(req, res, next);
});


router.get('/:id', authenticate, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.findById(req, res, next);
});


router.get('/:id/profiles', authenticate, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.getProfilesByAuthentication(req, res, next);
});

// --- POST Routes ---

router.post('/register', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.createAuthentication(req, res, next);
});


router.post('/login', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.standartAuthenticate(req, res, next);
});


router.post('/authenticate/external', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.authenticateExternal(req, res, next);
});


router.post('/logout', authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.logout(req, res, next);
});


router.post('/me/add-external', authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.addExternalAuthToAuthentication(req, res, next);
});


router.post('/forgot-password', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.requestPasswordReset(req, res, next);
});


router.post('/validate-password', authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.validatePassword(req, res, next);
});

// --- PUT Routes ---


router.put('/toggle-status/:id', authenticate, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.toggleAuthenticationStatus(req, res, next);
});


router.put('/update-password', authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.updatePassword(req, res, next);
});


router.put('/reset-password', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.updatePasswordReset(req, res, next);
});


router.put('/me', authenticate, (req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.updateMyAuthentication(req, res, next);
});


router.put('/:id', authenticate, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.updateAuthentication(req, res, next);
});

// --- DELETE Routes ---

router.delete('/gateway/:id', (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.deleteAuthentication(req, res, next);
});


router.delete('/:id', authenticate, authorize, (req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
  authController.deleteAuthentication(req, res, next);
});

export default router;

// src/routes/authenticationRouter.ts
import express from 'express';
import authorize from '../../_Autorização/middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';
import AuthenticationController from '../controllers/authenticationController.js';


const router = express.Router();

// --- GET Routes ---

router.get('/list', authenticate, authorize, (req, res, next) => {
  AuthenticationController.findAll(req, res, next);
});


router.get('/me', authenticate, (req, res, next) => {
  AuthenticationController.findMe(req, res, next);
});

router.get('/externals/:id', authenticate, authorize, (req, res, next) => {
  AuthenticationController.findAllByAuthenticationId(req, res, next);
});


router.get('/:id', authenticate, authorize, (req, res, next) => {
  AuthenticationController.findById(req, res, next);
});


router.get('/:id/profiles', authenticate, authorize, (req, res, next) => {
  AuthenticationController.getProfilesByAuthentication(req, res, next);
});

// --- POST Routes ---

router.post('/register', (req, res, next) => {
  AuthenticationController.createAuthentication(req, res, next);
});


router.post('/login', (req, res, next) => {
  AuthenticationController.standartAuthenticate(req, res, next);
});


router.post('/authenticate/external', (req, res, next) => {
  AuthenticationController.authenticateExternal(req, res, next);
});


router.post('/logout', authenticate, (req, res, next) => {
  AuthenticationController.logout(req, res, next);
});


router.post('/me/add-external', authenticate, (req, res, next) => {
  AuthenticationController.addExternalAuthToAuthentication(req, res, next);
});


router.post('/forgot-password', (req, res, next) => {
  AuthenticationController.requestPasswordReset(req, res, next);
});


router.post('/validate-password', authenticate, (req, res, next) => {
  AuthenticationController.validatePassword(req, res, next);
});

// --- PUT Routes ---


router.put('/toggle-status/:id', authenticate, authorize, (req, res, next) => {
  AuthenticationController.toggleAuthenticationStatus(req, res, next);
});


router.put('/update-password', authenticate, (req, res, next) => {
  AuthenticationController.updatePassword(req, res, next);
});


router.put('/reset-password', (req, res, next) => {
  AuthenticationController.updatePasswordReset(req, res, next);
});


router.put('/me', authenticate, (req, res, next) => {
  AuthenticationController.updateMyAuthentication(req, res, next);
});


router.put('/:id', authenticate, authorize, (req, res, next) => {
  AuthenticationController.updateAuthentication(req, res, next);
});

// --- DELETE Routes ---

router.delete('/gateway/:id', (req, res, next) => {
  AuthenticationController.deleteAuthentication(req, res, next);
});


router.delete('/:id', authenticate, authorize, (req, res, next) => {
  AuthenticationController.deleteAuthentication(req, res, next);
});

export default router;

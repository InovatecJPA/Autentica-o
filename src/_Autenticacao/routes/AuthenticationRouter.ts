// src/routes/authenticationRouter.ts
import express from 'express';
import authorize from '../../_Autorização/middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';
import AuthenticationController from '../controllers/authenticationController.js';

const authController = AuthenticationController.getInstance();

const router = express.Router();

// --- GET Routes ---

router.get('/list', authenticate, authorize, (req, res, next) => {
  authController.findAll(req, res, next);
});


router.get('/me', authenticate, (req, res, next) => {
  authController.findMe(req, res, next);
});

router.get('/externals/:id', authenticate, authorize, (req, res, next) => {
  authController.findAllByAuthenticationId(req, res, next);
});


router.get('/:id', authenticate, authorize, (req, res, next) => {
  authController.findById(req, res, next);
});


router.get('/:id/profiles', authenticate, authorize, (req, res, next) => {
  authController.getProfilesByAuthentication(req, res, next);
});

// --- POST Routes ---

router.post('/register', (req, res, next) => {
  authController.createAuthentication(req, res, next);
});


router.post('/login', (req, res, next) => {
  authController.standartAuthenticate(req, res, next);
});


router.post('/authenticate/external', (req, res, next) => {
  authController.authenticateExternal(req, res, next);
});


router.post('/logout', authenticate, (req, res, next) => {
  authController.logout(req, res, next);
});


router.post('/me/add-external', authenticate, (req, res, next) => {
  authController.addExternalAuthToAuthentication(req, res, next);
});


router.post('/forgot-password', (req, res, next) => {
  authController.requestPasswordReset(req, res, next);
});


router.post('/validate-password', authenticate, (req, res, next) => {
  authController.validatePassword(req, res, next);
});

// --- PUT Routes ---


router.put('/toggle-status/:id', authenticate, authorize, (req, res, next) => {
  authController.toggleAuthenticationStatus(req, res, next);
});


router.put('/update-password', authenticate, (req, res, next) => {
  authController.updatePassword(req, res, next);
});


router.put('/reset-password', (req, res, next) => {
  authController.updatePasswordReset(req, res, next);
});


router.put('/me', authenticate, (req, res, next) => {
  authController.updateMyAuthentication(req, res, next);
});


router.put('/:id', authenticate, authorize, (req, res, next) => {
  authController.updateAuthentication(req, res, next);
});

// --- DELETE Routes ---

router.delete('/gateway/:id', (req, res, next) => {
  authController.deleteAuthentication(req, res, next);
});


router.delete('/:id', authenticate, authorize, (req, res, next) => {
  authController.deleteAuthentication(req, res, next);
});

export default router;

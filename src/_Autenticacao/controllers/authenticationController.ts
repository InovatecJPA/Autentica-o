import createAuthStrategy from "../auth/authFactory";
import { IAuthenticationParams, IAuthenticationController, IAuthenticationService, IAuthStrategy, IAuthentication} from "../Interfaces/authInterfaces";
import { IHttpAuthenticatedRequest, IHttpRequest, IHttpResponse, IHttpNext } from "../../interfaces/httpInterface";
import AuthenticationService from "../services/authenticationService";
import HttpError from "../../utils/customErrors/httpError";
import {sendPasswordResetEmail} from "../../utils/mail/Email"
import { IProfileService } from "../../_Autorização/Interfaces/profileInterfaces";
import profileService from "../../_Autorização/services/profileService";

import dotenv from 'dotenv'
import cookieSession from "cookie-session";
dotenv.config()

class AuthenticationController implements IAuthenticationController{
    private static instance: AuthenticationController;
    private authService: IAuthenticationService;
    private authStrategy: IAuthStrategy;
    private profileService: IProfileService;
 
    /**
     * The private constructor for the AuthenticationController.
     * It is private because only the getInstance method should be able to create an instance of this class.
     * @param authService The authentication service to use.
     */
    private constructor(authService: IAuthenticationService) {
        this.authService = authService;
        this.authStrategy = createAuthStrategy();
        this.profileService = profileService;
    }


    /**
     * Gets an instance of the AuthenticationController.
     * If the instance doesn't exist, it creates one with the given authService.
     * @param authService The authentication service to use.
     * @returns The instance of the AuthenticationController.
     */
    static getInstance(authService: IAuthenticationService): AuthenticationController {
        if (!AuthenticationController.instance) {
            AuthenticationController.instance = new AuthenticationController(authService);
        }               

        return AuthenticationController.instance; 
    }

    /**
     * @inheritdoc
     */
    async findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const authentications = await this.authService.findAll();
    
            if (authentications.length < 1) {
                throw new HttpError(404, 'Authentications not found');
            }
                        
            res.status(200).json(authentications);
        } catch (error: any) {
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async findMe(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const id = req.session.auth.id;

            const user = await this.authService.findById(id!);

            if(!user) {
                throw new HttpError(404, 'User not found');
            }

            res.status(200).json(user);
        } catch (error: any) {
            next(error)
        }
    }


    /**
     * @inheritdoc
     */
    async findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                throw new HttpError(400, 'Id is required');
            }

            const auth = await this.authService.findById(id);
            
            if (!auth) {
                throw new HttpError(404, 'Authentication not found');
            }

            res.status(200).json(auth);
        } catch (error: any) {
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async createAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        let auth: IAuthentication | undefined
        try {
            const { login, password, externalId, isExternal }  = req.body;

            const authData: IAuthenticationParams = {
                login,
                passwordHash: password,
                externalId,
                isExternal,
            }
                        
            if(isExternal){
                if(!externalId){
                    throw new HttpError(400, 'External Id is required');
                }

                auth = await this.authService.createExternalAuthentication(authData);
            }else{ 
                if(!login || !password){
                    throw new HttpError(400, 'Login and password are required');
                }

                auth = await this.authService.createStandartAuthentication(authData);
            }

            if (!auth) {
                throw new HttpError(400, 'Authentication not created');
            }

            const profile_id = process.env.USER_COMUM_PROFILE!

            await this.profileService.addProfilesToAuthentication([profile_id], auth.id);


            res.status(201).json(auth);
        } catch (error: any) {
            if (auth && auth.id) {
                await this.authService.deleteAuthentication(auth.id)
            }

            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async updateMyAuthentication(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const id = req.session?.auth?.id;
            const {isExternal, externalId} = req.body;
            
            if(!id){
                throw new HttpError(400, 'Id is required');
            }
            
            if( (isExternal && !externalId) ){
                throw new HttpError(400, 'IsExternal or externalId is required');
            }
            
            const authData: Partial<IAuthenticationParams> = {
                isExternal,
                externalId,
            }
            
            const updatedAuth = await this.authService.updateAuthentication(id, authData);
            res.status(200).json(updatedAuth);
        } catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async updateAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const {id} = req.params;
            const {login, isExternal, externalId } = req.body;

            if(!id){
                throw new HttpError(400, 'Id is required');
            }

            if(!login && (isExternal && !externalId)){
                throw new HttpError(400, 'Login, isExternal or externalId is required');
            }

            const authData: Partial<IAuthenticationParams> = {
                login,
                isExternal,
                externalId,
            }

            const updatedAuth = await this.authService.updateAuthentication(id, authData);
            res.status(200).json(updatedAuth);
        }catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async requestPasswordReset(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { login } = req.body;
            
            if (!login){
                throw new HttpError(400, 'Login is required');
            }

            const auth = await this.authService.findByLogin(login);
            
            if (!auth) {
               throw new HttpError(404, 'Authentication not found');
            }

            const token = await this.authService.setPasswordTokenAndExpiryDate(auth!.id);
            
            const sent = await sendPasswordResetEmail(login, token)

            if (!sent) {
                throw new HttpError(500, 'Error sending email');
            }

            res.status(204).send({})
        }catch(error: any){
            next(error)
        }
    }

    /**
     * Fase de testes
     */
    async updatePasswordReset(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { token } = req.params;
            const { password } = req.body;

            if(!token){
                throw new HttpError(400, 'Token is required');
            }
            if(!password){
                throw new HttpError(400, 'Password is required');
            }
            console.log(token, password);
            const user = await this.authService.findByToken(token);
            console.log(user);
            if(!user){
                throw new HttpError(404, 'Authentication not found');
            }

            if(!user.password_token_expiry_date || user.password_token_expiry_date < new Date()){
                throw new HttpError(403, 'Token expired');
            }

            await this.authService.updatePassword(user.id, password);
            res.status(204).json({})
        } catch(error: any){
            next(error)
        }
    }
    
    /**
     * @inheritdoc
     */
    async deleteAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { id } = req.params;

            if(!id){
                throw new HttpError(400, 'Id is required');
            }

            await this.authService.deleteAuthentication(id);
            res.status(204)
        }catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async authenticate(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { login, password, isExternal, externalId  } = req.body;
            let auth = null

            if (isExternal) {
                if (!externalId) {
                    throw new HttpError(400, 'External Id is required');
                } else {
                    auth = await this.authService.findByExternalId(externalId);
                    
                    if (!auth) {
                        throw new HttpError(404, 'Authentication not found');
                    }

                    if (auth!.active === false) {
                        throw new HttpError(403, 'Authentication not activated');
                    }

                }
            } else {
                if (!login || !password) {
                    throw new HttpError(400, 'Login and password are required');
                }

                auth = await this.authService.authenticate(login, password);

                if (!auth) {
                    throw new HttpError(404, 'Authentication not found');
                }
            }

            const tokenOrSessionId = await this.authStrategy.authenticate(req, {id: auth!.id}); 
            if (!tokenOrSessionId) {
                throw new HttpError(400, 'AuthStrategy Failed');
            }

            res.status(200).json({ tokenOrSessionId });
        }catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async updatePassword(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { oldPassword, newPassword} = req.body;
            const id = req.session?.auth?.id;

            if (!oldPassword || !newPassword) {
                throw new HttpError(400, 'Password is required');
            }

            if (!id) {
                throw new HttpError(400, 'Invalid credentials');
            }

            if (!await this.authService.validatePassword(id, oldPassword)) {
                throw new HttpError(400, 'Invalid password');
            }

            await this.authService.updatePassword(id!, newPassword);
            res.status(204);
        } catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async toggleAuthenticationStatus(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            
            const { id } = req.params;
            const { toggle } = req.query;

            if (!id) {
                throw new HttpError(400, 'Invalid credentials');
            }

            if (toggle === 'true') {
                await this.authService.activateAccountAuthentication(id!);
            } else {
                await this.authService.deactivateAccountAuthentication(id!);
            }

            res.status(204)
        } catch(error: any){
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async validatePassword(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const {password} = req.body;
            const id = req.session?.auth?.id;
            
            if (!password) {
                throw new HttpError(400, 'Password is required');
            }

            if (!id) {
                throw new HttpError(400, 'Invalid credentials');
            }

            const valid = await this.authService.validatePassword(id!, password);
            
            if (!valid) {
                res.status(400).json({ message: 'Password invalid' });
                return
            } 

            res.status(200).json({ message: 'Password valid' });
        } catch (error: any) {
            next(error)
        }       
    }

    /**
     * @inheritdoc
     */
    async logout(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            if (!req.session) {
                throw new HttpError(400, 'Invalid credentials');
            }

            req.session.destroy((error: any) => {
                if (error) {
                    next(error);
                    return;
                }
                res.status(204);
            });
        }catch (error: any) {
            next(error)
        }
    }

    
    async getProfilesByAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;

            const profiles = await this.authService.getProfilesByAuthenticationId(id);

            if (!profiles || profiles.length === 0) {
                throw new HttpError(404, 'Profiles not found');
            }

            res.status(200).json(profiles);
        } catch(error: any){
            next(error)
        }
    }
}
    
export default AuthenticationController.getInstance(AuthenticationService);
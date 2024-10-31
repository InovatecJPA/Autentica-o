import createAuthStrategy from "../auth/authFactory";
import { IAuthenticationParams, IAuthenticationController, IAuthenticationService, IAuthStrategy, IAuthentication} from "../Interfaces/authInterfaces";
import { IHttpAuthenticatedRequest, IHttpRequest, IHttpResponse, IHttpNext } from "../../interfaces/httpInterface";
import AuthenticationService from "../services/authenticationService";
import HttpError from "../../utils/customErrors/httpError";
import {sendPasswordResetEmail} from "../../utils/mail/Email"

class AuthenticationController implements IAuthenticationController{
    private static instance: AuthenticationController;
    private authService: IAuthenticationService;
    private authStrategy: IAuthStrategy;
 
    /**
     * The private constructor for the AuthenticationController.
     * It is private because only the getInstance method should be able to create an instance of this class.
     * @param authService The authentication service to use.
     */
    private constructor(authService: IAuthenticationService) {
        this.authService = authService;
        this.authStrategy = createAuthStrategy();
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
        try {
            let auth: IAuthentication
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

            res.status(201).json(auth);
        } catch (error: any) {
            next(error)
        }
    }

    /**
     * @inheritdoc
     */
    async updateMyAuthentication(req: IHttpAuthenticatedRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const id = req.session?.auth?.id;
            const {login, isExternal, externalId} = req.body;
            
            if(!id){
                throw new HttpError(400, 'Id is required');
            }
            
            if(!login && (isExternal && !externalId) ){
                throw new HttpError(400, 'Login, isExternal or externalId is required');
            }
            
            const authData: Partial<IAuthenticationParams> = {
                login,
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

            await sendPasswordResetEmail(login, token);
            res.status(204)
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

            const user = await this.authService.findByToken(token);

            if(!user){
                throw new HttpError(404, 'Authentication not found');
            }

            if(!user.password_token_expiry_date || user.password_token_expiry_date < new Date()){
                throw new HttpError(403, 'Token expired');
            }

            await this.authService.updatePassword(user.id, password);
            res.status(204)
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

}

export default AuthenticationController.getInstance(AuthenticationService);
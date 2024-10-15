import createAuthStrategy from "../auth/authFactory";
import { IAuthenticationParams, IAuthenticationController, IAuthenticationService, IAuthStrategy} from "../interfaces/authInterfaces";
import { IHttpRequest, IHttpResponse } from "../interfaces/httpInterface";
import AuthenticationService from "../services/authenticationService";
 
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
     * Finds all the authentications.
     * @param req The request object.
     * @param res The response object.
     * @returns A promise that resolves with the list of authentications, or a 404 status code if no authentications are found.
     * @throws {Error} If an error occurs while finding the authentications.
     */
    async findAll(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try {
            const authentications = await this.authService.findAll();
    
            if (authentications) {
                res.status(200).json(authentications);
            } else {
                res.status(404).json({ message: 'No authentications found' });
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message }); 
        }
    }


    /**
     * Finds an authentication by id.
     * @param req The request object.
     * @param res The response object.
     * @returns A promise that resolves with the authentication if it exists, or a 404 status code if it doesn't.
     */
    async findById(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try {
            const { id } = req.params;

            const auth = await this.authService.findById(id);
            
            if (auth) {
                res.status(200).json(auth);
            } else {
                res.status(404).json({ message: 'Authentication not found' });
            }   
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    /**
     * Creates a new authentication in the database.
     * @param req The request object. The authentication data should be in the body of the request.
     * @param res The response object.
     * @returns A promise that resolves with a 201 status code if the authentication is created successfully, or a 500 status code if an error occurs.
     * @throws {Error} If an error occurs while creating the authentication.
     */
    async createAuthentication(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try {
            const { login, password, externalId, isExternal }  = req.body;

            const authData: IAuthenticationParams = {
                login,
                passwordHash: password, 
                externalId,
                isExternal
            }
            if(isExternal){
                if(!externalId){
                    res.status(400).json('External Id is required');
                }
                await this.authService.createAuthentication(authData);
            }else{ 
                if(!login || !password){
                    res.status(400).json('Login and password are required');
                }
                await this.authService.createExternalAuthentication(authData);
            }

    
            res.status(201).json({ message: 'Authentication created successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateAuthentication(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try{
            const {id} = req.params;
            const {login, isExternal } = req.body;

            const authData: Partial<IAuthenticationParams> = {
                login,
                isExternal
            }

            await this.authService.updateAuthentication(id, authData);
            res.status(200).json({ message: 'Authentication updated successfully' });
        }catch(error: any){
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Requests a password change for a given authentication, generating a
     * password token and expiry date.
     * @param req The request object. The login of the authentication to change
     *            the password for should be in the body of the request.
     * @param res The response object.
     * @returns A promise that resolves with a 200 status code if the password
     *          token was created successfully, or a 404 status code if the
     *          authentication was not found, or a 500 status code if an error
     *          occurs.
     * @throws {Error} If an error occurs while creating the password token.
     */
    async requestPasswordChange(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try{
            const { login } = req.body;
            const auth = await this.authService.findByLogin(login);
            if (!auth) {
                res.status(404).json({ message: 'Authentication not found' });
            }

            this.authService.setPasswordTokenAndExpiryDate(auth!.id);
            // Implementar funcionalidade
            // Criar serviço de email
            // this.mailerService.sendPasswordResetEmail(auth!.login);
            res.status(200).json({ message: 'Password token created successfully' });
        }catch(error: any){
            res.status(500).json({ message: error.message });
        }
    }
    
    /**
     * Deletes an authentication.
     * @param req The request object. The id of the authentication to delete
     *            should be in the params of the request.
     * @param res The response object.
     * @returns A promise that resolves with a 200 status code if the
     *          authentication was deleted successfully, or a 500 status code if
     *          an error occurs.
     * @throws {Error} If an error occurs while deleting the authentication.
     */
    async deleteAuthentication(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try{
            const { id } = req.params;

            await this.authService.deleteAuthentication(id);
            res.status(200).json({ message: 'Authentication deleted successfully' });
        }catch(error: any){
            res.status(500).json({ message: error.message });
        }
    }

    async authenticate(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try{
            const { login, password } = req.body;
            
            const auth = await this.authService.authenticate(login, password);
            if (!auth) {
                res.status(401).json({ message: 'Invalid credentials' });
            }

            const tokenOrSessionId = await this.authStrategy.authenticate({id: auth!.id}); 
            if (tokenOrSessionId) {
                res.status(200).json({ tokenOrSessionId });
            }
        }catch(error: any){
            res.status(500).json({ message: error.message });
            
        }
    }

    async updatePassword(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try{
            const { password } = req.body;
            const id = req.auth?.id;
            
            if (!id) {
                res.status(401).json({ message: 'Invalid credentials' });
            }

            await this.authService.updatePassword(id!, password);
            res.status(200).json({ message: 'Password updated successfully' });
        } catch(error: any){
            res.status(500).json({ message: error.message });   
        }
        throw new Error("Method not implemented.");
    }

    async toogleAuthenticationStatus(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try{
            const { toogle } = req.query;
            const id = req.auth?.id;

            if (!id) {
                res.status(401).json({ message: 'Invalid credentials' });
            }

            if (toogle === 'true') {
                await this.authService.activateAccountAuthentication(id!);
            } else {
                await this.authService.deactivateAccountAuthentication(id!);
            }

            res.status(200).json({ message: 'Account updated successfully' });
        } catch(error: any){
            res.status(500).json({ message: error.message });   
        }
        throw new Error("Method not implemented.");
    }

    async validatePassword(req: IHttpRequest, res: IHttpResponse): Promise<void> {
        try {
            const {passwordHash} = req.body;
            const id = req.auth?.id;

            if (!id) {
                res.status(401).json({ message: 'Invalid credentials' });
            }

            const valid = await this.authService.validatePassword(id!, passwordHash);
            
            if (valid) {
                res.status(200).json({ message: 'Password valid' });
            } else {
                res.status(400).json({ message: 'Password invalid' });
            }         
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
        throw new Error("Method not implemented.");
        
    }
}

export default AuthenticationController.getInstance(AuthenticationService);
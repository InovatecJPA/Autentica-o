import { IAuthenticationParams, IAuthenticationController, IAuthenticationService } from "../interfaces/interfaces";
import AuthenticationService from "../services/authenticationService";
import { Request, Response } from "express";

class AuthenticationController implements IAuthenticationController{
    private static instance: AuthenticationController;
    private authService: IAuthenticationService;
 
    /**
     * The private constructor for the AuthenticationController.
     * It is private because only the getInstance method should be able to create an instance of this class.
     * @param authService The authentication service to use.
     */
    private constructor(authService: IAuthenticationService) {
        this.authService = authService;
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
    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const authentications = await this.authService.findAll();
    
            if (authentications) {
                res.status(200).json(authentications);
            } else {
                res.status(404).json({ message: 'No authentications found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message }); 
        }
    }


    /**
     * Finds an authentication by id.
     * @param req The request object.
     * @param res The response object.
     * @returns A promise that resolves with the authentication if it exists, or a 404 status code if it doesn't.
     */
    async findById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const auth = await this.authService.findById(id);
            
            if (auth) {
                res.status(200).json(auth);
            } else {
                res.status(404).json({ message: 'Authentication not found' });
            }   
        } catch (error) {
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
    async createAuthentication(req: Request, res: Response): Promise<void> {
        try {
            const { login, password, externalId, isExternal }  = req.body;

            const authData: IAuthenticationParams = {
                login,
                passwordHash: password, 
                externalId,
                isExternal
            }
            await this.authService.createAuthentication(authData);
    
            res.status(201).json({ message: 'Authentication created successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }



    


    async updateAuthentication(req: Request, res: Response): Promise<void> {
        try{
            const {id} = req.params;
            const {login, isExternal } = req.body;

            const authData: Partial<IAuthenticationParams> = {
                login,
                isExternal
            }

            await this.authService.updateAuthentication(id, authData);
            res.status(200).json({ message: 'Authentication updated successfully' });
        }catch(error){
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
    async requestPasswordChange(req: Request, res: Response): Promise<void> {
        try{
            const { login } = req.body;
            const auth = await this.authService.findByLogin(login);
            if (!auth) {
                res.status(404).json({ message: 'Authentication not found' });
            }

            this.authService.setPasswordTokenAndExpiryDate(auth!.id);
            res.status(200).json({ message: 'Password token created successfully' });
        }catch(error){
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
    async deleteAuthentication(req: Request, res: Response): Promise<void> {
        try{
            const { id } = req.params;

            await this.authService.deleteAuthentication(id);
            res.status(200).json({ message: 'Authentication deleted successfully' });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }

    async authenticate(req: Request, res: Response): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    async updatePassword(req: Request, res: Response): Promise<void> {
        // try{
            // const { password } = req.body;
            // const id = req.user.id;
            
            // await this.authService.updatePassword(id, password);
        //     res.status(200).json({ message: 'Password updated successfully' });
        // } catch(error){
        //     res.status(500).json({ message: error.message });   
        // }
        throw new Error("Method not implemented.");
    }

    async toogleAuthenticationStatus(req: Request, res: Response): Promise<void> {
        // try{
            // const { toogle } = req.query;
            // const id = req.user.id;
        //     if (toogle === 'true') {
        //         await this.authService.activateAccountAuthentication(req.params.id);
        //     } else {
        //         await this.authService.deactivateAccountAuthentication(req.params.id);
        //     }
        //     res.status(200).json({ message: 'Account updated successfully' });
        // } catch(error){
        //     res.status(500).json({ message: error.message });   
        // }
        throw new Error("Method not implemented.");
    }

    async validatePassword(req: Request, res: Response): Promise<void> {
        // try {
        //     const {passwordHash} = req.body;
        //     const id = req.user.id;
        //     const valid = await this.authService.validatePassword(id, passwordHash);
            
        //     if (valid) {
        //         res.status(200).json({ message: 'Password valid' });
        //     } else {
        //         res.status(400).json({ message: 'Password invalid' });
        //     }         
        // } catch (error) {
        //     res.status(500).json({ message: error.message });
        // }
        throw new Error("Method not implemented.");
        
    }
}

export default AuthenticationController.getInstance(AuthenticationService);
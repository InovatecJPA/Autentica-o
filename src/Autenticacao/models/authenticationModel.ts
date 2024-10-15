import { v4 as uuidv4 } from 'uuid';
import { IAuthenticationParams, IAuthentication } from '../interfaces/authInterfaces';



class Authentication implements IAuthentication { 
    id: string;
    login!: string | null;
    passwordHash!: string | null;
    isExternal: boolean;
    externalId!: string | null;
    active: boolean;
    password_token_reset!: string | null;
    password_token_expiry_date!: Date | null;
    createdAt: Date;
    updatedAt: Date;
    
    /**
     * Construtor da classe Authentication.
     * @param {{login: string | null, passwordHash: string | null, externalId: string | null, isExternal: boolean}} params
     * @throws {Error} Caso o login ou passwordHash sejam nulos e isExternal seja false
     * @throws {Error} Caso o externalId seja nulo e isExternal seja true
     */
    constructor({login = null, passwordHash = null, externalId = null, isExternal} : IAuthenticationParams){
        
        if (isExternal){
            this.validateExternalId(externalId!);
            this.externalId = externalId;
        }
        else {
            this.validateLoginCredentials(login!, passwordHash!);
            this.login = login;
            this.passwordHash = passwordHash;
        }

        this.id = uuidv4()
        this.isExternal = isExternal;
        this.password_token_reset = null;
        this.password_token_expiry_date = null;
        this.active = true ;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }


    /**
     * Valida se o externalId é nulo.
     * @param {string} externalId
     * @throws {Error} Caso o externalId seja nulo
     * @private
     */
    private validateExternalId(externalId: string): void {
        if (!externalId) {
            throw new Error('externalId é nulo');
        }
    }

    /**
     * Valida se o login ou passwordHash são nulos.
     * @param {string} login
     * @param {string} passwordHash
     * @throws {Error} Caso o login ou passwordHash sejam nulos
     * @private
     */
    private validateLoginCredentials(login: string, passwordHash: string): void {
        if (!login || !passwordHash) {
            throw new Error('login ou passwordHash são nulos');
        }
    }
}

export default Authentication;
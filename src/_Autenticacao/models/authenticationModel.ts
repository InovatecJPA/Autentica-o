import { v4 as uuidv4 } from 'uuid';
import { IAuthentication } from '../Interfaces/authInterfaces.js';
import { authSchema } from '../schemas/auth.schema.js';



class Authentication implements IAuthentication { 
    id: string;
    login: string;
    passwordHash: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    
    /**
     * Construtor da classe Authentication.
     * @param {{login: string, passwordHash: string}} params
     * @throws {Error} Caso o login ou passwordHash sejam nulos e isExternal seja false
     * @throws {Error} Caso o externalId seja nulo e isExternal seja true
     */
    private constructor(data : IAuthentication){
        this.login = data.login;
        this.passwordHash = data.passwordHash;

        this.id = uuidv4()
        this.active = data.active ;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public static create(data: unknown): Authentication {
        const parsedData = authSchema.parse(data);
        return new Authentication(parsedData)
    }

}

export default Authentication;
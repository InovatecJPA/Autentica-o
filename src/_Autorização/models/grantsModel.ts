import { v4 as uuidv4 } from 'uuid';
import { IGrants, IGrantsParams } from "../Interfaces/grantsInterfaces";

class Grants implements IGrants {
    id: string
    method: string
    path: string
    description: string | null
    profileList?: string[]
    createdAt: Date
    updatedAt: Date

    constructor({method, path, description = null} : IGrantsParams){
        this.validatePath(path);
        this.validateMethod(method);
        this.method = method;
        this.path = path;

        this.id = uuidv4();
        this.profileList = [];
        this.description = description;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    private validatePath(path: string): void {
        if (!path) {
            throw new Error('path é nulo');
        }
        const pathRegex = /^\/[a-zA-Z0-9\/_-]*$/;
        if (!pathRegex.test(path)) {
            throw new Error('path incorreto');
        }
    }

    private validateMethod(method: string): void {
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']

        if (!validMethods.includes(method.toUpperCase())) {
            throw new Error('metodo invalido');
        }
    }
}

export default Grants
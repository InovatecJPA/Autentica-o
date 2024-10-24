import { v4 as uuidv4 } from 'uuid';
import { IProfile, IProfileParams } from '../Interfaces/profileInterfaces';



class Profile implements IProfile { 
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;

    constructor({name, description = null} : IProfileParams){
        this.validateName(name);
        this.name = name;

        this.id = uuidv4()
        this.description = description
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    validateName(name: string): void {
        if (!name) {
            throw new Error('name é nulo');
        }
    }

}

export default Profile;
import { IExternalAuthentication } from "../Interfaces/authInterfaces";

class ExternalAuthentication implements IExternalAuthentication {
    external_id: string;
    authentication_id: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;

    constructor({provider, external_id, authentication_id} : IExternalAuthentication) {
        this.provider = provider;
        this.external_id = external_id;
        this.authentication_id = authentication_id;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

export default ExternalAuthentication
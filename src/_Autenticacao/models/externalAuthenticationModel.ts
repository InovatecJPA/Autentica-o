import { IExternalAuthentication } from "../Interfaces/authInterfaces.js";
import { ExternalAuthSchema } from "../schemas/externalAuth.schema.js";

class ExternalAuthentication implements IExternalAuthentication {
    external_id: string;
    authentication_id: string;
    email: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: IExternalAuthentication) {
        this.provider = data.provider;
        this.external_id = data.external_id;
        this.authentication_id = data.authentication_id;
        this.email = data.email;
        this.createdAt = new Date()
        this.updatedAt = new Date()
    }

    public static create(data: unknown) {
        const parsedData = ExternalAuthSchema.parse(data);
        return new ExternalAuthentication(parsedData)
    }
}

export default ExternalAuthentication;

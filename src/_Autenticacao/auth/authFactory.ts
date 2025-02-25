import { IAuthStrategy } from "../Interfaces/authInterfaces.js";
import jwtFactory from "./auths/jwtFactory.js";
import sessionFactory from "./auths/sessionFactory.js";

import dotenv from 'dotenv';
dotenv.config();

function createAuthStrategy(): IAuthStrategy {
    if (process.env.AUTH_STRATEGY === "jwt")  {
        return new jwtFactory();
    }

    if (process.env.AUTH_STRATEGY === "session") {
        return new sessionFactory();
    }

    
   throw new Error("Repository not found");
}


export default createAuthStrategy;

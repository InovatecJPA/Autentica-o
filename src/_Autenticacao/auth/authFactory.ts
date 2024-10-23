import { IAuthStrategy } from "../Interfaces/authInterfaces";
import JwtStrategy from "./strategies/jwtStrategy";
import SessionStrategy from "./strategies/sessionStrategy";
import dotenv from 'dotenv';

dotenv.config();

function createAuthStrategy(): IAuthStrategy {
    if (process.env.AUTH_STRATEGY === "jwt")  {
        return new JwtStrategy();
    }

    if (process.env.AUTH_STRATEGY === "session") {
        return new SessionStrategy();
    }

    
   throw new Error("Repository not found");
}


export default createAuthStrategy;

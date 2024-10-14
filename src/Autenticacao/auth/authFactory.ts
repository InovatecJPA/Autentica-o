import { IAuthStrategy } from "../interfaces/interfaces";
import JwtStrategy from "./strategies/jwtStrategy";
import PassportStrategy from "./strategies/passportStrategy";
import SessionStrategy from "./strategies/sessionStrategy";


function createAuthStrategy(): IAuthStrategy {
    if (process.env.AUTH_STRATEGY === "jwt")  {
        return new JwtStrategy();
    }

    if (process.env.AUTH_STRATEGY === "session") {
        return new SessionStrategy();
    }

    if (process.env.AUTH_STRATEGY === "passport") {
        return new PassportStrategy();
    }
    
   throw new Error("Repository not found");
}


export default createAuthStrategy;

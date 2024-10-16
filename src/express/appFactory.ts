import { ExpressApp } from "./expressApp";

function createAppFactory() {
    return new ExpressApp();
}

export default createAppFactory
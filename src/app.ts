import dotenv from 'dotenv';
dotenv.config();
import HttpError from './utils/customErrors/httpError';
import { IApp } from './interfaces/appInterface';
import createAppFactory from './Apps/appFactory';
import { IHttpNext, IHttpRequest, IHttpResponse } from './interfaces/httpInterface';
import AuthenticationRouter from './Autenticacao/routes/AuthenticationRouter';
import bodyParser from 'body-parser';

class App {
    public app: IApp;
    private static instance: App;
    
    constructor(){
        this.app = createAppFactory();
        this.middlewares();
        this.routes();
        this.errorHandler();
    }
    
    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    

    private middlewares() {
        this.app.use(bodyParser.json());
    }

    private routes() {
        AuthenticationRouter.registerRoutes("/v1/auth", this.app.router);    

        this.app.use(this.app.router.getRouter());
    }

    private errorHandler() {
        this.app.use((err: any, req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            if (!res.headersSent) {
                if (err instanceof HttpError) {
                    res.status(err.status).json({ message: err.message });
                } else {
                    res.status(500).json({ message: err.message });
                }
            } else {
                next();
            }
        });
    }

    public start(port: number): void {
        this.app.start(port);
    }
}

export default App.getInstance();

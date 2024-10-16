import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import authRouter from "./Autenticacao/routes/AuthenticationRouter";
import HttpError from './utils/customErrors/httpError';
import { IApp } from './interfaces/appInterface';
import AuthenticationRouter from './Autenticacao/routes/AuthenticationRouter';
import createAppFactory from './express/appFactory';

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
        // this.app.use();
    }

    private routes() {
        // AuthenticationRouter.registerRoutes(this.app) ;
    }

    private errorHandler() {
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (!res.headersSent) {
                if (err instanceof HttpError) {
                    res.status(err.status).json({ message: err.message });
                } else {
                    res.status(500).json({ message: err.message });
                }
            } else {
                next(err);
            }
        });
    }

    public start(port: number): void {
        this.app.start(port);
    }
}

export default App.getInstance();

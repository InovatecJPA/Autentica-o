import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import authRouter from "./Autenticacao/routes/AuthenticationRouter";
import HttpError from './utils/customErrors/httpError';
import { IHttpNext, IHttpRequest, IHttpResponse } from './interfaces/httpInterface';

class App {
    public app: express.Application;
    private static instace: App;

    constructor(){
        this.app = express();
        this.middlewares();
        this.routes();
        this.errorHandler();
    }

    public static getInstance(): App {
        if (!App.instace) {
            App.instace = new App();
        }
        return App.instace;
    }

    private middlewares(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        if (process.env.AUTH_STRATEGY === 'session') {
            this.app.use(session({
                secret: process.env.SESSION_SECRET || "cat",
                resave: false,
                saveUninitialized: false,
                cookie: { secure: false },
            }));
        }
    }


    private routes() {
        this.app.use('/auth', authRouter);
    }

    private errorHandler(){
        this.app.use((err: any, req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            if(!res.headersSent){
                if (err instanceof HttpError){
                    res.status(err.status).json({ message: err.message });
                } else {
                    res.status(500).json({ message: err.message });
                }
            }else{
                next(err);
            }
        });
        }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}


export default App.getInstance();

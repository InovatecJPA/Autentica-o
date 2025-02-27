import HttpError from './utils/customErrors/httpError.js';
import { IHttpNext, IHttpRequest, IHttpResponse } from './interfaces/httpInterface.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors, { CorsOptions } from 'cors'
import express, { Application, Router } from 'express';

import AutenticationRouter from './_Autenticacao/routes/AuthenticationRouter.js'

import dotenv from 'dotenv';
dotenv.config();
  

const whiteList = ['http://127.0.0.1:3000', 'http://localhost:3000'];

const corsOptions: CorsOptions = {
  origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
    if (!requestOrigin || whiteList.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  
  credentials: true
};

function useSession(app: Application) {
    if (process.env.AUTH_STRATEGY !== 'session') {
      return;
    }
  
    const isProduction = process.env.PROJETO_FASE === 'production';
  
    app.use(
      session({
        secret: process.env.SESSION_SECRET || 'HESTIA',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 24 * 60 * 60 * 1000,
          secure: isProduction, 
        },
      })
    );
  }

class App {
    public app: Application;
    public router: Router
    private static instance: App;
    
    /**
     * Creates a new instance of the App class.
     * It initializes the application by registering all the middlewares, routes and error handlers.
     */
    constructor(){
        this.app = express();
        this.router = Router()
        this.middlewares();
        this.routes();
        this.errorHandler();
    }
    
    /**
     * Returns a singleton instance of the App class.
     * If the instance does not exist, it creates a new one.
     * Ensures that only one instance of the App class is created.
     *
     * @returns {App} The single instance of the App class.
     */
    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    private middlewares() {
        this.app.use(cors(corsOptions));
        this.app.use(bodyParser.json());
        useSession(this.app)
    }

    private routes() {
        this.app.use("/v1/auth", AutenticationRouter);    
        // ProfileRouter.registerRoutes("/profile", this.app.router);
    }

    /**
     * Registers a global error handler for the application.
     * 
     * If the error is an instance of HttpError, it is handled by returning a JSON response with the status and message of the error.
     * If the error is not an instance of HttpError, it is handled by returning a JSON response with a status of 500 and the error message.
     * 
     * This error handler is applied to the application after all routes have been registered.
     */
    private errorHandler() {
        this.app.use((err: any, req: IHttpRequest, res: IHttpResponse, next: IHttpNext) => {
            if (err instanceof HttpError) {
                res.status(err.status).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }

        });
    }

    public start(port: number): void {
        this.app.listen(port);
        console.log(`${process.env.BASE_URL}:${port}/api-docs`)
    }
}

export default App.getInstance();



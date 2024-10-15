import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

class App {
    public app: express.Application;
    private static instace: App;

    constructor(){
        this.app = express();
        this.middlewares();
        this.routes();
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
        this.app.get('/', (req, res) => {
            res.send('Hello World!!!!!!!');
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}


export default App.getInstance();

import express from 'express';
import session from 'express-session';

const app = express();

// Outros middlewares (body-parser, etc.)
app.use(express.json());

if (process.env.AUTH_STRATEGY === 'session') {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    }));
}


export default app;

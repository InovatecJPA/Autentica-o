// main.ts
import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config();


app.start(Number(process.env.PORT) || 3500);

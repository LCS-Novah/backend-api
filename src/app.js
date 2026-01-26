import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

app.use(express.json({extended:true,limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(express.cookieParser())


export default app;
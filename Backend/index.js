
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { connectDb } from './config/db.js';
import cors from 'cors';
import ProfileRoutes from './routes/profile.js';
dotenv.config();
import cookieParser from 'cookie-parser';
import PostRoutes from './routes/post.js';

const PORT=process.env.PORT || 3000;
const app=express();
connectDb();
// const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());

app.use(express.json());
app.use('/images', express.static('public/images'));
app.use('/auth',authRoutes);
app.use("/profile",ProfileRoutes);
app.use("/post",PostRoutes);

app.listen(PORT,()=>
{
    console.log(`Server run on ${PORT}`);
})


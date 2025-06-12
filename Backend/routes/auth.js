import express from 'express';
import {  isAuthenticated, SignIn, SignOut, SignUp } from '../controllers/authController.js';

const authRoutes=express.Router();

authRoutes.post('/sign-in',SignIn);
authRoutes.post('/sign-up',SignUp);
authRoutes.post('/sign-out',SignOut);
authRoutes.get('/is-authenticated', isAuthenticated);


export default authRoutes;
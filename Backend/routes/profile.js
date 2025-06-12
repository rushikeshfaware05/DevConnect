import express from 'express';
import { Delete, getProfile, Update } from '../controllers/profileController.js';
import upload from '../midlewares/multer.js';

const ProfileRoutes =express.Router();

ProfileRoutes.post('/update',upload.single("image"),Update);
ProfileRoutes.delete('/delete/:userId',Delete);
ProfileRoutes.get('/:userId',getProfile);

export default ProfileRoutes;
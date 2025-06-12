import express from 'express';
import { addComment, createPost, deletPost, getAllPosts, getLikeUnlinke, getSinglePost, updatePost } from '../controllers/postController.js';
import { authMiddleware } from '../midlewares/authMiddleware.js';

const PostRoutes=express.Router();

PostRoutes.post("/create", authMiddleware,createPost);
PostRoutes.get('/getall',getAllPosts);
PostRoutes.get('/getsingle',getSinglePost);
PostRoutes.put('/update/:id',authMiddleware,updatePost);
PostRoutes.delete('/delete/:id',authMiddleware,deletPost);
PostRoutes.post('/:id/like',authMiddleware,getLikeUnlinke);
PostRoutes.post(':id/comment',authMiddleware,addComment);


export default PostRoutes;
import Post from "../models/Post.js";

const createPost=async(req,res)=>
{
    try {
    const { title, body, tags } = req.body;
    const newPost = new Post({
      userId: req.user.id,
      title,
      body,
      tags,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
}

const getAllPosts=async(req,res)=>
{
     try {
    const posts = await Post.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to get posts" });
  }
}

const getSinglePost=async(req,res)=>
{
   try {
    const posts = await Post.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to get posts" });
  }
}

const updatePost=async(req,res)=>
{
     try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    const { title, body, tags } = req.body;
    post.title = title || post.title;
    post.body = body || post.body;
    post.tags = tags || post.tags;
    post.updatedAt = Date.now();

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
}

const deletPost=async(req,res)=>
{
    try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
}

 const getLikeUnlinke=async(req,res)=>
 {
      try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    const likedIndex = post.likes.indexOf(userId);

    if (likedIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likedIndex, 1);
    }

    await post.save();
    res.json({ likesCount: post.likes.length, liked: likedIndex === -1 });
  } catch (err) {
    res.status(500).json({ error: "Failed to like/unlike post" });
  }
 }

 const addComment=async(req,res)=>
 {
     try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = {
      userId: req.user.id,
      username: req.user.username,
      text: req.body.text,
    };

    post.comments.push(comment);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
 }

 export {createPost,getAllPosts,getSinglePost,updatePost,deletPost,getLikeUnlinke,addComment};
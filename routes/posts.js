const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Create Post

router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//Update Post   

router.put("/:id", async (req, res) => {
    try {
        const post= await Post.findById(req.params.id);
        if(post.username == req.body.username){
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
                    $set: req.body
                },{new: true});
                res.status(200).json(updatedPost);
            } catch (err) {
                res.status(500).json(err);
            }
        }
        else{
            res.status(401).json("you can only update your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete Post

router.delete("/:id", async (req, res) => {
    try {
        const post= await Post.findById(req.params.id);
        if(post.username == req.body.username){
            try {
                await post.delete();
                res.status(200).json("Post has been deleted..!")
            } catch (err) {
                res.status(500).json(err);
            }
        }
        else{
            res.status(401).json("you can only delete your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get Post

router.get("/:id", async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Posts
router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;

    try {
        let posts;

        if (username) {
            posts = await Post.find({ username: username }).sort({ createdAt: -1 });
        } else if (catName) {
            posts = await Post.find({ categories: { $in: [catName] } }).sort({ createdAt: -1 });
        } else {
            posts = await Post.find().sort({ createdAt: -1 });
        }

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
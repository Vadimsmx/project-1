// src/routes/posts.routes.js
const express = require("express");
const { getAllPosts, getPostById, createPost } = require("../repositories/postsRepo");
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        res.json({ data: await getAllPosts() });
    } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json({ data: post });
    } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
    try {
        const { userId, title, body } = req.body;
        if (!userId || !title || !body) return res.status(400).json({ error: "userId, title, body are required" });
        
        const created = await createPost(userId, title, body);
        res.status(201).json({ data: created });
    } catch (err) { next(err); }
});

module.exports = router;
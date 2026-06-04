const express = require("express");
const { getAllPosts, getPostById, createPost, deletePost } = require("../repositories/postsRepo");
const { logAction, getStats, getTopCommenters } = require("../repositories/statsRepo");
const { demoAuth } = require("../middlewares/auth");
const { validateCreatePost } = require("../middlewares/validate"); 

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        res.json({ data: await getAllPosts() });
    } catch (err) { next(err); }
});

router.get("/analytics/stats", async (req, res, next) => {
    try {
        const stats = await getStats();
        res.json({ data: stats });
    } catch (err) { next(err); }
});

router.get("/analytics/top-commenters", async (req, res, next) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            return res.status(400).json({ 
                error: "Параметри 'from' та 'to' є обов'язковими." 
            });
        }
        const topCommenters = await getTopCommenters(from, to);
        res.json({ data: topCommenters });
    } catch (err) { next(err); }
});

router.get("/:id", demoAuth, async (req, res, next) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden: You don't own this post" });
        }

        res.json({ data: post });
    } catch (err) { next(err); }
});

router.post(
    "/", 
    demoAuth,           
    validateCreatePost,  
    async (req, res, next) => {
        try {
            const { title, content } = req.body;
            const created = await createPost(req.user.id, title, content);
            
            await logAction(req.user.id, "CREATE_POST", `Успішно створено пост з ID: ${created.id}`);
            res.status(201).json({ data: created });
        } catch (err) { 
            if (req.user && req.user.id) {
                await logAction(req.user.id, "CREATE_POST_FAILED", err.message);
            }
            next(err); 
        }
    }
);

router.delete("/:id", demoAuth, async (req, res, next) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await deletePost(req.params.id);
        await logAction(req.user.id, "DELETE_POST", `Видалено пост з ID: ${req.params.id}`);
        res.status(204).send();
    } catch (err) { next(err); }
});

module.exports = router;
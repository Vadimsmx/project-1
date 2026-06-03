const express = require("express");
const { getAllPosts, getPostById, createPost } = require("../repositories/postsRepo");
const { logAction, getStats, getTopCommenters } = require("../repositories/statsRepo");
const { validateCreatePost } = require("../middlewares/validate");
const { checkAuth, checkPostOwnership } = require("../middlewares/auth");

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
                error: "Параметри 'from' та 'to' (ISO формати дат, наприклад 2026-05-01) є обов'язковими." 
            });
        }

        const topCommenters = await getTopCommenters(from, to);
        res.json({ data: topCommenters });
    } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json({ data: post });
    } catch (err) { next(err); }
});

router.post(
    "/", 
    checkAuth,           
    validateCreatePost,  
    checkPostOwnership,  
    async (req, res, next) => {
        try {
            // Змінено: дістаємо content замість body, бо валідація вимагає саме content
            const { userId, title, content } = req.body;
            const created = await createPost(userId, title, content);
            
            await logAction(userId, "CREATE_POST", `Успішно створено пост з ID: ${created.id}`);

            res.status(201).json({ data: created });
        } catch (err) { 
            if (req.user && req.user.id) {
                await logAction(req.user.id, "CREATE_POST_FAILED", err.message);
            }
            next(err); 
        }
    }
);

module.exports = router;
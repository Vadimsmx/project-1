const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Тимчасове сховище постів (In-memory storage для 2-ї лаби)
let posts = [];

// Отримати всі пости
router.get("/", (req, res, next) => {
    try {
        res.json({ data: posts });
    } catch (err) {
        next(err);
    }
});

// Отримати пост за ID
router.get("/:id", (req, res, next) => {
    try {
        const post = posts.find(p => p.id === req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        res.json({ data: post });
    } catch (err) {
        next(err);
    }
});

// Створити новий пост
router.post("/", (req, res, next) => {
    try {
        const { userId, title, body } = req.body;
        
        if (!userId || !title || !body) {
            return res.status(400).json({ error: "userId, title, body are required" });
        }

        const newPost = {
            id: uuidv4(),
            userId,
            title,
            body,
            createdAt: new Date().toISOString()
        };

        posts.push(newPost);
        res.status(201).json({ data: newPost });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
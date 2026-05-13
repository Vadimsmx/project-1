// src/routes/users.routes.js
const express = require("express");
const { getAllUsers, getUserById, createUser } = require("../repositories/usersRepo");
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.json({ data: users });
    } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ data: user });
    } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) return res.status(400).json({ error: "email and name are required" });
        
        const created = await createUser(email, name);
        res.status(201).json({ data: created });
    } catch (err) {
        if (String(err.message).includes("UNIQUE constraint failed")) {
            return res.status(409).json({ error: "Email already exists" });
        }
        next(err);
    }
});

module.exports = router;
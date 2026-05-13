const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // Імпортуємо для генерації ID

// Тимчасове сховище даних (замість БД у 2-й лабі)
let users = []; 

// Отримати всіх користувачів
router.get("/", (req, res, next) => {
    try {
        res.json({ data: users });
    } catch (err) { 
        next(err); 
    }
});

// Отримати користувача за ID
router.get("/:id", (req, res, next) => {
    try {
        const user = users.find(u => u.id === req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json({ data: user });
    } catch (err) { 
        next(err); 
    }
});

// Створити нового користувача
router.post("/", (req, res, next) => {
    try {
        const { email, name } = req.body;
        
        if (!email || !name) {
            return res.status(400).json({ error: "email and name are required" });
        }

        // Перевірка на унікальність email (заміна UNIQUE constraint з SQL)
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const newUser = {
            id: uuidv4(), // Генеруємо унікальний ID
            email,
            name
        };

        users.push(newUser);
        res.status(201).json({ data: newUser });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
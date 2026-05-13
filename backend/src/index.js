const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware для парсингу JSON body (обов'язково для роботи з req.body) [cite: 333, 334]
app.use(express.json());

// 1. Мінімальне логування кожного запиту [cite: 448, 449]
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

// 2. Дані зберігаються в оперативній пам'яті [cite: 427, 442]
const db = {
    users: [],
    posts: []
};

// 3. Централізована помилка (Керована помилка для валідації та 404) [cite: 415, 416, 417]
class ApiError extends Error {
    constructor(status, code, message, details = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

// Функція для валідації рядків [cite: 408]
function requireString(value, fieldName, minLen = 1) {
    if (typeof value !== "string" || value.trim().length < minLen) {
        return { field: fieldName, message: `${fieldName} must be a non-empty string of at least ${minLen} chars` };
    }
    return null;
}

// Валідатор для Users [cite: 444, 445]
function validateUser(req, res, next) {
    const { name, email } = req.body;
    const errors = [];
    
    const e1 = requireString(name, "name", 2);
    if (e1) errors.push(e1);
    
    const e2 = requireString(email, "email", 5);
    if (e2) errors.push(e2);

    if (errors.length > 0) {
        // Викидаємо помилку, яка потрапить у центральний обробник [cite: 418, 419]
        return next(new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors));
    }
    next();
}

// Валідатор для Posts [cite: 444, 445]
function validatePost(req, res, next) {
    const { title, content } = req.body;
    const errors = [];
    
    const e1 = requireString(title, "title", 3);
    if (e1) errors.push(e1);
    
    const e2 = requireString(content, "content", 10);
    if (e2) errors.push(e2);

    if (errors.length > 0) {
        return next(new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors));
    }
    next();
}

// --- МАРШРУТИ ДЛЯ USERS --- [cite: 439, 441]

// GET /api/users - отримати список
app.get('/api/users', (req, res) => {
    res.status(200).json({ items: db.users }); // 200 OK [cite: 431]
});

// GET /api/users/:id - отримати за ID
app.get('/api/users/:id', (req, res, next) => {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found")); // 404 Not Found [cite: 431]
    res.status(200).json(user);
});

// POST /api/users - створити
app.post('/api/users', validateUser, (req, res) => {
    // DTO: запит не містить id, id генерується на сервері [cite: 430, 442, 443]
    const { name, email } = req.body; 
    const newUser = { id: uuidv4(), name, email };
    db.users.push(newUser);
    res.status(201).json(newUser); // 201 Created [cite: 431]
});

// PUT /api/users/:id - оновити
app.put('/api/users/:id', validateUser, (req, res, next) => {
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    
    const { name, email } = req.body;
    db.users[index] = { ...db.users[index], name, email };
    res.status(200).json(db.users[index]);
});

// DELETE /api/users/:id - видалити
app.delete('/api/users/:id', (req, res, next) => {
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    
    db.users.splice(index, 1);
    res.status(204).send(); // 204 No Content [cite: 431]
});

// --- МАРШРУТИ ДЛЯ POSTS (Доменна сутність) --- [cite: 440, 441]

app.get('/api/posts', (req, res) => {
    res.status(200).json({ items: db.posts });
});

app.get('/api/posts/:id', (req, res, next) => {
    const post = db.posts.find(p => p.id === req.params.id);
    if (!post) return next(new ApiError(404, "NOT_FOUND", "Post not found"));
    res.status(200).json(post);
});

app.post('/api/posts', validatePost, (req, res) => {
    const { title, content } = req.body;
    const newPost = { id: uuidv4(), title, content };
    db.posts.push(newPost);
    res.status(201).json(newPost);
});

app.put('/api/posts/:id', validatePost, (req, res, next) => {
    const index = db.posts.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new ApiError(404, "NOT_FOUND", "Post not found"));
    
    const { title, content } = req.body;
    db.posts[index] = { ...db.posts[index], title, content };
    res.status(200).json(db.posts[index]);
});

app.delete('/api/posts/:id', (req, res, next) => {
    const index = db.posts.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new ApiError(404, "NOT_FOUND", "Post not found"));
    
    db.posts.splice(index, 1);
    res.status(204).send();
});

// ОБРОБКА ПОМИЛОК 

// Обробник для неіснуючих маршрутів
app.use((req, res, next) => {
    next(new ApiError(404, "NOT_FOUND", "Route not found"));
});

// 4. Централізований error-handler [cite: 446, 447, 448]
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details || []
            }
        });
    }

    // Неочікувані помилки (500) [cite: 420, 431]
    console.error("Unhandled error:", err);
    res.status(500).json({
        error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API started on http://localhost:${PORT}`);
});
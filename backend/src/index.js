const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); 

const app = express();

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500']
}));

app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

const db = {
    users: [],
    resources: [] 
};


class ApiError extends Error {
    constructor(status, code, message, details = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

function requireString(value, fieldName, minLen = 1) {
    if (typeof value !== "string" || value.trim().length < minLen) {
        return { field: fieldName, message: `${fieldName} must be a non-empty string of at least ${minLen} chars` };
    }
    return null;
}


function validateUser(req, res, next) {
    const { name, email } = req.body;
    const errors = [];
    const e1 = requireString(name, "name", 2);
    if (e1) errors.push(e1);
    const e2 = requireString(email, "email", 5);
    if (e2) errors.push(e2);

    if (errors.length > 0) {
        return next(new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors));
    }
    next();
}


function validateResource(req, res, next) {
    const { title, url, type, author } = req.body;
    const errors = [];
    
    const e1 = requireString(title, "title", 2);
    if (e1) errors.push(e1);
    const e2 = requireString(url, "url", 5);
    if (e2) errors.push(e2);

    if (errors.length > 0) {
        return next(new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors));
    }
    next();
}


app.get('/api/users', (req, res) => {
    res.status(200).json({ items: db.users }); 
});

app.get('/api/users/:id', (req, res, next) => {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found")); 
    res.status(200).json(user);
});

app.post('/api/users', validateUser, (req, res) => {
    const { name, email } = req.body; 
    const newUser = { id: uuidv4(), name, email };
    db.users.push(newUser);
    res.status(201).json(newUser); 
});

app.put('/api/users/:id', validateUser, (req, res, next) => {
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    
    const { name, email } = req.body;
    db.users[index] = { ...db.users[index], name, email };
    res.status(200).json(db.users[index]);
});

app.delete('/api/users/:id', (req, res, next) => {
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) return next(new ApiError(404, "NOT_FOUND", "User not found"));
    db.users.splice(index, 1);
    res.status(204).send(); 
});


app.get('/api/resources', (req, res) => {
    res.status(200).json({ items: db.resources });
});

app.get('/api/resources/:id', (req, res, next) => {
    const resource = db.resources.find(r => r.id === req.params.id);
    if (!resource) return next(new ApiError(404, "NOT_FOUND", "Resource not found"));
    res.status(200).json(resource);
});

app.post('/api/resources', validateResource, (req, res) => {
    const { title, url, type, description, author } = req.body;
    const newResource = { id: uuidv4(), title, url, type, description, author };
    db.resources.push(newResource);
    res.status(201).json(newResource);
});

app.put('/api/resources/:id', validateResource, (req, res, next) => {
    const index = db.resources.findIndex(r => r.id === req.params.id);
    if (index === -1) return next(new ApiError(404, "NOT_FOUND", "Resource not found"));
    
    const { title, url, type, description, author } = req.body;
    db.resources[index] = { ...db.resources[index], title, url, type, description, author };
    res.status(200).json(db.resources[index]);
});

app.delete('/api/resources/:id', (req, res, next) => {
    const index = db.resources.findIndex(r => r.id === req.params.id);
    if (index === -1) return next(new ApiError(404, "NOT_FOUND", "Resource not found"));
    db.resources.splice(index, 1);
    res.status(204).send();
});


app.use((req, res, next) => {
    next(new ApiError(404, "NOT_FOUND", "Route not found"));
});


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

    console.error("Unhandled error:", err);
    res.status(500).json({
        error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API started on http://localhost:${PORT}`);
});

module.exports = { app };
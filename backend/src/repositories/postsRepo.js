// src/repositories/postsRepo.js
const { all, get, run } = require("../db/dbClient");

function escapeSqlString(s) {
    return String(s).replace(/'/g, "''");
}

async function getAllPosts() {
    return await all(`SELECT id, userId, title, body, createdAt FROM Posts ORDER BY id DESC;`);
}

async function getPostById(id) {
    return await get(`SELECT id, userId, title, body, createdAt FROM Posts WHERE id = ${Number(id)};`);
}

async function createPost(userId, title, body) {
    const now = new Date().toISOString();
    const uid = Number(userId);
    const safeTitle = escapeSqlString(title);
    const safeBody = escapeSqlString(body);

    const result = await run(`
        INSERT INTO Posts (userId, title, body, createdAt)
        VALUES (${uid}, '${safeTitle}', '${safeBody}', '${now}');
    `);
    return await getPostById(result.lastID);
}

module.exports = { getAllPosts, getPostById, createPost };

const { all, get, run } = require("../db/dbClient");

function escapeSqlString(s) {
    return String(s).replace(/'/g, "''");
}

async function getAllPosts() {
    return await all(`SELECT id, userId, title, content, createdAt FROM Posts ORDER BY id DESC;`);
}

async function getPostById(id) {
    return await get(`SELECT id, userId, title, content, createdAt FROM Posts WHERE id = ${Number(id)};`);
}

async function createPost(userId, title, content) {
    const now = new Date().toISOString();
    const uid = Number(userId);
    const safeTitle = escapeSqlString(title);
    const safeContent = escapeSqlString(content);

    const result = await run(`
        INSERT INTO Posts (userId, title, content, createdAt)
        VALUES (${uid}, '${safeTitle}', '${safeContent}', '${now}');
    `);
    return await getPostById(result.lastID);
}

module.exports = { getAllPosts, getPostById, createPost };
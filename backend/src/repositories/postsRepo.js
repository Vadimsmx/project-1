const { all, get, run } = require("../db/dbClient");

async function getAllPosts() {
    return await all(`SELECT id, userId, title, content, createdAt FROM Posts ORDER BY id DESC;`);
}

async function getPostById(id) {

    return await get(`SELECT id, userId, title, content, createdAt FROM Posts WHERE id = ?;`, [id]);
}

async function createPost(userId, title, content) {
    const now = new Date().toISOString();
    
    
    const result = await run(`
        INSERT INTO Posts (userId, title, content, createdAt)
        VALUES (?, ?, ?, ?);
    `, [userId, title, content, now]);
    
    return await getPostById(result.lastID);
}


async function deletePost(id) {
    return await run(`DELETE FROM Posts WHERE id = ?;`, [id]);
}

module.exports = { getAllPosts, getPostById, createPost, deletePost };
// src/repositories/usersRepo.js
const { all, get, run } = require("../db/dbClient");

function escapeSqlString(s) {
    return String(s).replace(/'/g, "''");
}

async function getAllUsers() {
    // Демонстрація виконання вимоги WHERE + ORDER BY + LIMIT
    return await all(`
        SELECT id, email, name, createdAt 
        FROM Users 
        WHERE id > 0 
        ORDER BY id DESC 
        LIMIT 10;
    `);
}

async function getUserById(id) {
    return await get(`SELECT id, email, name, createdAt FROM Users WHERE id = ${Number(id)};`);
}

async function createUser(email, name) {
    const now = new Date().toISOString();
    const safeEmail = escapeSqlString(email);
    const safeName = escapeSqlString(name);
    
    const result = await run(`
        INSERT INTO Users (email, name, createdAt)
        VALUES ('${safeEmail}', '${safeName}', '${now}');
    `);
    return await getUserById(result.lastID);
}

module.exports = { getAllUsers, getUserById, createUser };
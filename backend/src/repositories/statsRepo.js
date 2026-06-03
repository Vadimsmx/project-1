const { run, all } = require("../db/dbClient");

async function initStatsTable() {
    await run(`
        CREATE TABLE IF NOT EXISTS Stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            actionType TEXT NOT NULL,
            details TEXT,
            createdAt TEXT NOT NULL
        );
    `);
}

async function logAction(userId, actionType, details) {
    const now = new Date().toISOString();
    try {
        await initStatsTable();


        const sql = `INSERT INTO Stats (userId, actionType, details, createdAt) VALUES (?, ?, ?, ?);`;
        await run(sql, [Number(userId), actionType, details || '', now]);
        
        console.log(`[Stats] Зафіксовано подію: ${actionType} для користувача ${userId}`);
    } catch (err) {
        console.error("Помилка запису статистики в БД:", err.message);
    }
}

async function getStats() {
    try {
        await initStatsTable();
        return await all(`SELECT id, userId, actionType, details, createdAt FROM Stats ORDER BY id DESC;`);
    } catch (err) {
        console.error("Помилка отримання статистики з БД:", err.message);
        return [];
    }
}


async function getTopCommenters(startDate, endDate) {
    try {
        const sql = `
            SELECT c.userId, u.name, u.email, COUNT(c.id) as commentCount
            FROM Comments c
            JOIN Users u ON c.userId = u.id
            WHERE c.createdAt BETWEEN ? AND ?
            GROUP BY c.userId
            ORDER BY commentCount DESC
            LIMIT 3;
        `;
        return await all(sql, [startDate, endDate]);
    } catch (err) {
        console.error("Помилка отримання топ коментаторів з БД:", err.message);
        return [];
    }
}

module.exports = { logAction, getStats, getTopCommenters };
// src/db/initDb.js
const { run } = require("./dbClient");

async function initDb() {
    await run("PRAGMA foreign_keys = ON;");

    await run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            createdAt TEXT NOT NULL
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Posts (
            id INTEGER PRIMARY KEY,
            userId INTEGER NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users (id) ON DELETE CASCADE
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Comments (
            id INTEGER PRIMARY KEY,
            postId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            body TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (postId) REFERENCES Posts (id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES Users (id) ON DELETE RESTRICT
        );
    `);

    console.log("DB schema initialized");
}

module.exports = { initDb };
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
            content TEXT NOT NULL, -- Змінено з body на content, щоб підходило під валідацію
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users (id) ON DELETE CASCADE
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Comments (
            id INTEGER PRIMARY KEY,
            postId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            body TEXT NOT NULL, -- Для коментарів залишаємо body, як і було
            createdAt TEXT NOT NULL,
            FOREIGN KEY (postId) REFERENCES Posts (id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES Users (id) ON DELETE RESTRICT
        );
    `);

    const now = new Date().toISOString();
    await run(`
        INSERT OR IGNORE INTO Users (id, email, name, createdAt)
        VALUES (1, 'vadym@example.com', 'Вадим', '${now}');
    `);

    console.log("DB schema initialized & default user verified/created");
}

module.exports = { initDb };
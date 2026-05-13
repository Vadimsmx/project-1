// src/server.js
const { app } = require("./app");

const PORT = process.env.PORT || 3000;

// У 2-й лабі ми використовуємо лише синхронний запуск сервера без ініціалізації БД
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
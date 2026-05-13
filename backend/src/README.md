Запустити сервер командою: npm run dev
Створення користувача (Успіх - 201): curl.exe -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{\"name\":\"Ivan\",\"email\":\"ivan@example.com\"}'
Створення користувача з помилкою валідації (Помилка - 400) : curl.exe -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{\"email\":\"ivan@example.com\"}'
Отримання списку всіх користувачів (Успіх - 200) : curl.exe -i http://localhost:3000/api/users
Видалення користувача за ID (Успіх - 204) : curl.exe -i -X DELETE http://localhost:3000/api/users/ВАШ ІD
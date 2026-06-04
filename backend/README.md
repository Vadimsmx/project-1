Запустити сервер командою: npm run dev
npm install cors для четвертої 

Створення користувача (Успіх - 201): curl.exe -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{\"name\":\"Ivan\",\"email\":\"ivan@example.com\"}'

Створення користувача з помилкою валідації (Помилка - 400) : curl.exe -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{\"email\":\"ivan@example.com\"}'

Отримання списку всіх користувачів (Успіх - 200) : curl.exe -i http://localhost:3000/api/users

Видалення користувача за ID (Успіх - 204) : curl.exe -i -X DELETE http://localhost:3000/api/users/ВАШ ІD

ДЛЯ ЛАБОРАТОРНОЇ №3

Отримання списку GET: Invoke-RestMethod -Uri http://localhost:3000/api/posts -Method Get

Для створення об'єкта POST: Invoke-RestMethod -Uri http://localhost:3000/api/users -Method Post -Body '{"name":"Vadym", "email":"vadym@example.com"}' -ContentType 'application/json'

Пошук за ІД : Invoke-RestMethod -Uri http://localhost:3000/api/users/fe08cb27-3971-4381-af22-0189134f6d2d -Method Get

Створення поста (зв'язок Foreign Key)

Видалення: Invoke-RestMethod -Uri http://localhost:3000/api/users/fe08cb27-3971-4381-af22-0189134f6d2d -Method Delete



Спроба створення поста БЕЗ авторизації: curl -X POST http://localhost:3000/api/posts \ -H "Content-Type: application/json" \ -d '{"userId": 1, "title": "Новий пост", "body": "Текст мого поста"}'

ДЛЯ ЗАХИСТУ : Створення успішного поста   Invoke-RestMethod -Uri "http://localhost:3000/api/posts" -Method Post -Headers @{"X-Auth-User-Id"="42"} -ContentType "application/json; charset=utf-8" -Body '{"userId": 42, "title": "М?й безпечний пост", "body": "Текст цього поста захищений.", "content": "Текст цього поста довжиною б?льше десяти символ?в."}'

Тест блокування без авторизації (401 Unauthorized) : try { Invoke-RestMethod -Uri "http://localhost:3000/api/posts" -Method Post -ContentType "application/json; charset=utf-8" -Body '{"userId": 42, "title": "Пост хакера", "content": "Мене не мають пропустити."}' } catch { $_.Exception.Response }

Тест помилки валідації (400 Bad Request) : try { Invoke-RestMethod -Uri "http://localhost:3000/api/posts" -Method Post -Headers @{"X-Auth-User-Id"="42"} -ContentType "application/json; charset=utf-8" -Body '{"userId": 42, "title": "", "content": "Короткий"}' } catch { $_.Exception.Response }

Тест захисту від підміни автора (403 Forbidden) : try { Invoke-RestMethod -Uri "http://localhost:3000/api/posts" -Method Post -Headers @{"X-Auth-User-Id"="42"} -ContentType "application/json; charset=utf-8" -Body '{"userId": 99, "title": "Чужий пост", "content": "Спроба підмінити автора поста."}' } catch { $_.Exception.Response }

ДЛЯ ЗАХИСТУ 2-3  : Створення користувача : $userBody = @{
    id = 1
    name = "Вадим"
    email = "vadym@example.com"
} | ConvertTo-Json -Compress

$userBytes = [System.Text.Encoding]::UTF8.GetBytes($userBody)

Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post -Body $userBytes -ContentType "application/json" | ConvertTo-Json -Depth 5



ДЛЯ ЛАБОРАТОРНОЇ 5:
Для створення поста: curl -X POST http://localhost:3000/api/posts \
-H "Content-Type: application/json" \
-H "X-Demo-UserId: 1" \
-d '{"userId":1,"title":"Тестовий пост","body":"Вміст захищеного поста","content":"Вміст захищеного поста"}'
Для перевірки списку: curl http://localhost:3000/api/posts

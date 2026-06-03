function checkAuth(req, res, next) {
    const authUserId = Number(req.headers['x-auth-user-id']); 

    // Перевіряємо, чи передано ID і чи є воно дійсним числом
    if (!authUserId || isNaN(authUserId)) {
        return res.status(401).json({ error: "Користувач не авторизований (відсутній або некоректний X-Auth-User-Id у заголовках)" });
    }

    req.user = { id: authUserId };
    next();
}

function checkPostOwnership(req, res, next) {
    const userId = Number(req.body.userId);
    
    // Перевіряємо, чи збігається ID з токена/заголовка з ID автора поста в тілі запиту
    if (!req.user || req.user.id !== userId) {
        return res.status(403).json({ error: "У вас немає прав для виконання цієї дії від імені іншого користувача" });
    }
    
    next();
}

module.exports = { checkAuth, checkPostOwnership };
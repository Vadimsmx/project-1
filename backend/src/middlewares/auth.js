
function demoAuth(req, res, next) {
    const userId = req.header("X-Demo-UserId");
    
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Missing X-Demo-UserId header" });
    }

    req.user = { id: parseInt(userId, 10) };
    next();
}

module.exports = { demoAuth };
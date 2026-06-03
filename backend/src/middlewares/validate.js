function validateCreatePost(req, res, next) {
    const { userId, title, body } = req.body;
    
    if (userId === undefined || userId === null || isNaN(Number(userId))) {
        return res.status(400).json({ error: "userId обов'язковий і має бути числом" });
    }
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "title обов'язковий і не може бути порожнім" });
    }
    if (!body || typeof body !== 'string' || body.trim() === '') {
        return res.status(400).json({ error: "body обов'язковий і не може бути порожнім" });
    }
    
    next();
}

module.exports = { validateCreatePost };


module.exports = { validateCreatePost };
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // nous extrayons le token du header Authorization de la requête entrante.
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(403).json({ error: 'Utilisateur non trouvé !' });
        } else {
            next();
        }
    } catch {
        response.status(401).json({
            error: 'Invalid request!'
        });
    }
};
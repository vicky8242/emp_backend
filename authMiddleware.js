const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Auth Error: No token provided' });
    }

    // Split on the space and take the second part
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;  // Now req.user contains the ID of the logged in user.
        // Now req.user contains the ID of the logged in user.
        next();
    } catch (e) {
        console.error(e);
        if (e instanceof jwt.TokenExpiredError) {
            res.status(401).send({ message: 'Token expired' });
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(500).send({ message: 'Invalid Token' });
        } else {
            res.status(500).send({ message: 'Something went wrong' });
        }
    }
};

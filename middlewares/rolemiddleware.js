const jwt = require('jsonwebtoken');
// Middleware to verify role
const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const role = req.role
            if (!roles.includes(role)) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Authorization error', error: error.message });
        }
    };
};

module.exports = {
    authorizeRoles
};

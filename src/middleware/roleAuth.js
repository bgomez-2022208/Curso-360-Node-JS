const usuarios = require('../usuarios/usuarios.model');
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(403).json({ message: 'Token mal formado, asegúrese de que esté en el formato "Bearer <token>"' });
    }

    const actualToken = tokenParts[1];

    jwt.verify(actualToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(500).json({ message: 'Failed to authenticate token', error: err.message });
        }

        req.user = {
            id: decoded.idUsuarios,
            rol_idrol: decoded.rol_idrol
        };
        next();
    });
};





const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Usuario no autenticado' });
        }

        const userRole = req.user.rol_idrol;
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado, no tienes permiso para realizar esta acción.' });
        }

        next();
    };
};

module.exports = { verifyToken, verifyRole };
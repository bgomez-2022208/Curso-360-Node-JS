const usuarios = require('../usuarios/usuarios.model')
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }
    const tokenWithoutBearer = token.replace('Bearer ', '');

    jwt.verify(tokenWithoutBearer, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Token Invalido' });
        }
        const userId = decoded.idUsuarios;

        if (!userId) {
            return res.status(400).send({ message: 'Invalid token structure, missing user ID' });
        }
        try {
            const user = await usuarios.findOne({ where: { idusuarios: userId } });

            if (!user) {
                return res.status(404).send({ message: 'No se encontro el usuario' });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Server error' });
        }
    });
};

const verifyRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.rol_idrol;
        if (!roles.includes(userRole)) {
            return res.status(403).send({ message: 'Acceso denegado tu no puedes hacer esta acción.' });
        }
        next()
    };
};

module.exports = { verifyToken, verifyRole };

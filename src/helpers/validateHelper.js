const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            status: 400,
            message: 'Errores de validación',
            errors: errors.array()
        });
    }
    next();
};

module.exports = { validateResult };

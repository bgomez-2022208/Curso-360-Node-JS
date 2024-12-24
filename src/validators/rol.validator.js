const { check } = require('express-validator');
const { validateResult } = require("../helpers/validateHelper");

const validateCreate = [
    check('nombreRol').exists().withMessage('El nombre es obligatorio')
        .not().isEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
    .isLength({ max: 45 }).withMessage('El nombre no puede tener más de 45 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateUpdate = [
    check('name').optional()
        .not().isEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
        .isLength({ max: 45 }).withMessage('El nombre no puede tener más de 45 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateCreate, validateUpdate };
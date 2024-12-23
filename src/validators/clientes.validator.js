const { check } = require('express-validator');
const { validateResult } = require("../helpers/validateHelper");

const validateClientesCreate = [
    check('razonSocial')
        .not().isEmpty().withMessage('La razón social es obligatoria')
        .isLength({ min: 3 }).withMessage('La razón social debe tener al menos 3 caracteres'),

    check('nombreComercial')
        .not().isEmpty().withMessage('El nombre comercial es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre comercial debe tener al menos 3 caracteres'),

    check('direccionEntrega')
        .optional()
        .isLength({ min: 3 }).withMessage('La dirección de entrega debe tener al menos 3 caracteres'),

    check('telefono')
        .not().isEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^[\d\s+-]+$/).withMessage('El teléfono debe contener solo números, espacios o el símbolo +')
        .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 caracteres'),

    check('email')
        .not().isEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El correo electrónico no es válido'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateClientesUpdate = [
    check('razonSocial')
        .optional()
        .isLength({ min: 3 }).withMessage('La razón social debe tener al menos 3 caracteres'),

    check('nombreComercial')
        .optional()
        .isLength({ min: 3 }).withMessage('El nombre comercial debe tener al menos 3 caracteres'),

    check('direccionEntrega')
        .optional()
        .isLength({ min: 3 }).withMessage('La dirección de entrega debe tener al menos 3 caracteres'),

    check('telefono')
        .not().isEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^[\d\s+-]+$/).withMessage('El teléfono debe contener solo números, espacios o el símbolo +')
        .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 caracteres'),

    check('email')
        .optional()
        .isEmail().withMessage('El correo electrónico no es válido'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateClientesCreate, validateClientesUpdate };

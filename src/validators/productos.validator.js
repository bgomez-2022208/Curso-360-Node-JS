const { check } = require('express-validator');
const { validateResult } = require("../helpers/validateHelper");

const validateCreateProducto = [
    check('idCategoriaProductos')
        .isInt().withMessage('El id de la categoría debe ser un número entero')
        .not().isEmpty().withMessage('El id de la categoría es obligatorio'),

    check('idUsuarios')
        .isInt().withMessage('El id del usuario debe ser un número entero')
        .not().isEmpty().withMessage('El id del usuario es obligatorio'),

    check('nombreProducto')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ max: 45 }).withMessage('El nombre no puede tener más de 45 caracteres')
        .not().isEmpty().withMessage('El nombre es obligatorio'),

    check('marcaProducto')
        .isString().withMessage('La marca debe ser una cadena de texto')
        .isLength({ max: 45 }).withMessage('La marca no puede tener más de 45 caracteres')
        .not().isEmpty().withMessage('La marca es obligatoria'),

    check('codigoProducto')
        .isString().withMessage('El código debe ser una cadena de texto')
        .isLength({ max: 45 }).withMessage('El código no puede tener más de 45 caracteres')
        .not().isEmpty().withMessage('El código es obligatorio'),

    check('stockProducto')
        .isDecimal().withMessage('El stock debe ser un número decimal')
        .isFloat({ gt: 0 }).withMessage('El stock debe ser mayor a 0')
        .not().isEmpty().withMessage('El stock es obligatorio'),

    check('estados_idestados')
        .isInt().withMessage('El id del estado debe ser un número entero')
        .not().isEmpty().withMessage('El id del estado es obligatorio'),

    check('precioProducto')
        .isDecimal().withMessage('El precio debe ser un número decimal')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0')
        .not().isEmpty().withMessage('El precio es obligatorio'),

    check('fechaCreacion')
        .isISO8601().withMessage('La fecha de creación debe tener un formato válido')
        .not().isEmpty().withMessage('La fecha de creación es obligatoria'),

    check('fotoProducto')
        .optional()
        .isLength({ max: 255 }).withMessage('La foto no puede exceder los 255 caracteres en base64'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateUpdateProducto = [
    check('idCategoriaProductos')
        .optional()
        .isInt().withMessage('El id de la categoría debe ser un número entero'),

    check('idUsuarios')
        .optional()
        .isInt().withMessage('El id del usuario debe ser un número entero'),

    check('nombreProducto')
        .optional()
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ max: 45 }).withMessage('El nombre no puede tener más de 45 caracteres'),

    check('marcaProducto')
        .optional()
        .isString().withMessage('La marca debe ser una cadena de texto')
        .isLength({ max: 45 }).withMessage('La marca no puede tener más de 45 caracteres'),

    check('codigoProducto')
        .optional()
        .isString().withMessage('El código debe ser una cadena de texto')
        .isLength({ max: 45 }).withMessage('El código no puede tener más de 45 caracteres'),

    check('stockProducto')
        .optional()
        .isDecimal().withMessage('El stock debe ser un número decimal')
        .isFloat({ gt: 0 }).withMessage('El stock debe ser mayor a 0'),

    check('estados_idestados')
        .optional()
        .isInt().withMessage('El id del estado debe ser un número entero'),

    check('precioProducto')
        .optional()
        .isDecimal().withMessage('El precio debe ser un número decimal')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),

    check('fechaCreacion')
        .optional()
        .isISO8601().withMessage('La fecha de creación debe tener un formato válido'),

    check('fotoProducto')
        .optional()
        .isLength({ max: 255 }).withMessage('La foto no puede exceder los 255 caracteres en base64'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateCreateProducto, validateUpdateProducto };

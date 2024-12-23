const { check } = require('express-validator');
const { validateResult } = require('../helpers/validateHelper');

const validateCreateOrdenDetalle = [
    check('idOrden')
        .not().isEmpty().withMessage('El ID de la orden es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID de la orden debe ser un número entero positivo'),
    check('idProducto')
        .not().isEmpty().withMessage('El ID del producto es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID del producto debe ser un número entero positivo'),
    check('cantidadDetalle')
        .not().isEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),
    check('precioDetalle')
        .not().isEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio del detalle debe ser mayor o igual a 0')
        .customSanitizer(value => parseFloat(value).toFixed(2)).withMessage('El total de la orden debe tener dos decimales'),
    check('subTotalDetalle')
        .not().isEmpty().withMessage('El subtotal es obligatorio')
        .isFloat({ min: 0 }).withMessage('El subtotal del detalle debe ser mayor o igual a 0')
        .customSanitizer(value => parseFloat(value).toFixed(2)).withMessage('El subtotal de la orden debe tener dos decimales'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateUpdateOrdenDetalle = [
    check('Orden_idOrden')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de la orden debe ser un número entero positivo'),
    check('Productos_idProductos')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del producto debe ser un número entero positivo'),
    check('cantidad')
        .optional()
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),
    check('precioDetalle')
        .not().isEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio del detalle debe ser mayor o igual a 0')
        .customSanitizer(value => parseFloat(value).toFixed(2)).withMessage('El total de la orden debe tener dos decimales'),
    check('subTotalDetalle')
        .not().isEmpty().withMessage('El subtotal es obligatorio')
        .isFloat({ min: 0 }).withMessage('El subtotal del detalle debe ser mayor o igual a 0')
        .customSanitizer(value => parseFloat(value).toFixed(2)).withMessage('El subtotal de la orden debe tener dos decimales'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateCreateOrdenDetalle, validateUpdateOrdenDetalle };
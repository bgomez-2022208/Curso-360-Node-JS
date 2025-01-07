const { check } = require('express-validator');
const { validateResult } = require("../helpers/validateHelper");

const validateCategoriaProducto = [

    check('nombreCategoriaProducto')
        .exists().withMessage('El campo nombreCategoriaProducto es requerido')
        .not().isEmpty().withMessage('El campo nombreCategoriaProducto no puede estar vacío')
        .isLength({ min: 3, max: 50 }).withMessage('El campo nombreCategoriaProducto debe tener entre 3 y 50 caracteres'),

    (req, res, next) => {
    validateResult(req, res, next);
    }
];

const validateCategoriaProductoUpdate = [
    check('nombreCategoriaProducto')
        .exists().withMessage('El campo nombreCategoriaProducto es requerido')
        .not().isEmpty().withMessage('El campo nombreCategoriaProducto no puede estar vacío')
        .isLength({ min: 3, max: 45 }).withMessage('El campo nombreCategoriaProducto debe tener entre 3 y 45 caracteres'),

    check('idEstado')
        .exists().withMessage('El campo idEstado es requerido')
        .isInt({ gt: 0 }).withMessage('El campo idEstado debe ser un número entero positivo'),

    (req, res, next) => validateResult(req, res, next),
];

module.exports = { validateCategoriaProducto, validateCategoriaProductoUpdate };
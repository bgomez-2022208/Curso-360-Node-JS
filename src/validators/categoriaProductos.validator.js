const { check } = require('express-validator');
const { validateResult } = require("../helpers/validateHelper");

const validateCategoriaProducto = [
    check('usuarios_idusuarios')
        .exists().withMessage('El campo usuarios_idusuarios es requerido')
        .isInt({ gt: 0 }).withMessage('El campo usuarios_idusuarios debe ser un número entero positivo'),

    check('nombreCategoriaProducto')
        .exists().withMessage('El campo nombreCategoriaProducto es requerido')
        .not().isEmpty().withMessage('El campo nombreCategoriaProducto no puede estar vacío')
        .isLength({ min: 3, max: 50 }).withMessage('El campo nombreCategoriaProducto debe tener entre 3 y 50 caracteres'),

    check('idEstado')
        .exists().withMessage('El campo idEstado es requerido')
        .isInt({ gt: 0 }).withMessage('El campo idEstado debe ser un número entero positivo'),

    check('fechaCreacion')
        .exists().withMessage('El campo fechaCreacion es requerido')
        .isISO8601().withMessage('El campo fechaCreacion debe ser una fecha válida en formato ISO 8601')
        .custom((value) => {
            const fechaCreacion = new Date(value);
            const fechaActual = new Date();
            if (fechaCreacion > fechaActual) {
                throw new Error('El campo fechaCreacion no puede ser una fecha futura');
            }
            return true;
        }),

    (req, res, next) => {
    validateResult(req, res, next);
    }
];

const validateCategoriaProductoUpdate = [
    check('usuarios_idusuarios')
        .exists().withMessage('El campo usuarios_idusuarios es requerido')
        .isInt({ gt: 0 }).withMessage('El campo usuarios_idusuarios debe ser un número entero positivo'),

    check('nombreCategoriaProducto')
        .exists().withMessage('El campo nombreCategoriaProducto es requerido')
        .not().isEmpty().withMessage('El campo nombreCategoriaProducto no puede estar vacío')
        .isLength({ min: 3, max: 45 }).withMessage('El campo nombreCategoriaProducto debe tener entre 3 y 45 caracteres'),

    check('idEstado')
        .exists().withMessage('El campo idEstado es requerido')
        .isInt({ gt: 0 }).withMessage('El campo idEstado debe ser un número entero positivo'),

    check('fechaCreacion')
        .exists().withMessage('El campo fechaCreacion es requerido')
        .isISO8601().withMessage('El campo fechaCreacion debe ser una fecha válida en formato ISO 8601')
        .custom((value) => {
            const fechaCreacion = new Date(value);
            const fechaActual = new Date();
            if (fechaCreacion > fechaActual) {
                throw new Error('El campo fechaCreacion no puede ser una fecha futura');
            }
            return true;
        }),

    (req, res, next) => validateResult(req, res, next),
];

module.exports = { validateCategoriaProducto, validateCategoriaProductoUpdate };
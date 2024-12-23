const { check } = require('express-validator');
const { validateResult } = require("../helpers/validateHelper");

const validateOrdenCreate = [
    check('usuarios_idusuarios')
        .exists().withMessage('El ID de usuario es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero positivo'),

    check('estados_idestados')
        .exists().withMessage('El ID de estado es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID de estado debe ser un número entero positivo'),

    check('nombreCompleto')
        .exists().withMessage('El nombre completo es obligatorio')
        .isLength({ max: 75 }).withMessage('El nombre completo no puede exceder los 75 caracteres'),

    check('ordenDireccion')
        .exists().withMessage('La dirección es obligatoria')
        .isLength({ max: 545 }).withMessage('La dirección no puede exceder los 545 caracteres'),

    check('ordenTelefono')
        .not().isEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^[\d\s+-]+$/).withMessage('El teléfono debe contener solo números, espacios o el símbolo +')
        .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 caracteres'),

    check('correoElectronico')
        .exists().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El correo electrónico debe ser válido')
        .isLength({ max: 75 }).withMessage('El correo electrónico no puede exceder los 75 caracteres'),

    check('fechaEntrega')
        .exists().withMessage('La fecha de entrega es obligatoria')
        .isISO8601().withMessage('La fecha de entrega debe ser una fecha válida')
        .custom((value) => {
            const now = new Date();
            if (new Date(value) <= now) {
                throw new Error('La fecha de entrega debe ser futura');
            }
            return true;
        }),

    check('totalOrden')
        .exists().withMessage('El total de la orden es obligatorio')
        .isDecimal({ decimal_digits: '2' }).withMessage('El total de la orden debe ser un número decimal con hasta 2 decimales')
        .isFloat({ min: 0 }).withMessage('El total de la orden debe ser mayor o igual a 0'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateOrdenUpdate = [
    check('usuarios_idusuarios')
        .optional()
        .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero positivo'),

    check('estados_idestados')
        .optional()
        .isInt({ min: 1 }).withMessage('El ID de estado debe ser un número entero positivo'),

    check('nombreCompleto')
        .optional()
        .isLength({ max: 75 }).withMessage('El nombre completo no puede exceder los 75 caracteres'),

    check('ordenDireccion')
        .optional()
        .isLength({ max: 545 }).withMessage('La dirección no puede exceder los 545 caracteres'),

    check('ordenTelefono')
        .not().isEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^[\d\s+-]+$/).withMessage('El teléfono debe contener solo números, espacios o el símbolo +')
        .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 caracteres'),

    check('correoElectronico')
        .trim()
        .not().isEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El correo electrónico no es válido')
        .isLength({ max: 75 }).withMessage('El correo electrónico no puede exceder los 75 caracteres'),

    check('fechaEntrega')
        .optional()
        .isISO8601().withMessage('La fecha de entrega debe ser una fecha válida')
        .custom((value) => {
            const now = new Date();
            if (new Date(value) <= now) {
                throw new Error('La fecha de entrega debe ser futura');
            }
            return true;
        }),

    check('totalOrden')
        .exists().withMessage('El total de la orden es obligatorio')
        .isFloat({ min: 0 }).withMessage('El total de la orden debe ser mayor o igual a 0')
        .customSanitizer(value => parseFloat(value).toFixed(2)).withMessage('El total de la orden debe tener dos decimales'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateOrdenCreate, validateOrdenUpdate };

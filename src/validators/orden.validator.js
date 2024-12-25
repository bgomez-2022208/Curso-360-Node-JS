const {check} = require('express-validator');
const {validateResult} = require("../helpers/validateHelper");

const validateOrdenCreate = [
    check('usuarios_idusuarios')
        .exists().withMessage('El ID de usuario es obligatorio')
        .isInt({min: 1}).withMessage('El ID de usuario debe ser un número entero positivo'),

    check('estados_idestados')
        .exists().withMessage('El ID de estado es obligatorio')
        .isInt({min: 1}).withMessage('El ID de estado debe ser un número entero positivo'),

    check('nombreCompleto')
        .exists().withMessage('El nombre completo es obligatorio')
        .isLength({min: 3}).withMessage('El nombre completo no puede ser menor a 3 caracteres')
        .isLength({max: 75}).withMessage('El nombre completo no puede exceder los 75 caracteres'),

    check('ordenDireccion')
        .exists().withMessage('La dirección es obligatoria')
        .isLength({min: 3}).withMessage('la direccion no puede ser menor a 3 caracteres')
        .isLength({max: 545}).withMessage('La dirección no puede exceder los 545 caracteres'),

    check('ordenTelefono')
        .not().isEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^[\d\s+-]+$/).withMessage('El teléfono debe contener solo números, espacios o el símbolo +')
        .isLength({min: 7, max: 15}).withMessage('El teléfono debe tener entre 7 y 15 caracteres'),

    check('correoElectronico')
        .exists().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El correo electrónico debe ser válido')
        .isLength({max: 75}).withMessage('El correo electrónico no puede exceder los 75 caracteres'),

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
        .isFloat({ min: 1 }).withMessage('El total de la orden debe ser mayor o igual a 0'),

    check('detalle')
        .isArray().withMessage('El campo detalle debe ser un array')
        .custom((value) => {
            if (!value || value.length === 0) {
                throw new Error('El campo detalle no puede estar vacío');
            }

            value.forEach(item => {
                if (!item.idProducto || !item.cantidadDetalle || !item.precioDetalle || !item.subTotalDetalle) {
                    throw new Error('Cada detalle debe tener idProducto, cantidadDetalle, precioDetalle y subTotalDetalle');
                }
                if (typeof item.idProducto !== 'number' || item.idProducto <= 0) {
                    throw new Error('El idProducto debe ser un número positivo');
                }
                if (typeof item.cantidadDetalle !== 'number' || item.cantidadDetalle <= 0) {
                    throw new Error('La cantidadDetalle debe ser un número positivo');
                }
                if (typeof item.precioDetalle !== 'number' || item.precioDetalle <= 0) {
                    throw new Error('El precioDetalle debe ser un número positivo');
                }
                if (typeof item.subTotalDetalle !== 'number' || item.subTotalDetalle <= 0) {
                    throw new Error('El subTotalDetalle debe ser un número positivo');
                }
            });
            return true;
        }),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { validateOrdenCreate };



module.exports = {validateOrdenCreate};

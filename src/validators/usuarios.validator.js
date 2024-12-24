const { check } = require('express-validator')
const { validateResult } = require("../helpers/validateHelper");

const validateUsuariosCreate =[
  check('rol_idrol')
      .exists().withMessage('El campo Rol Id es requerido')
      .isInt({ gt: 0 }).withMessage('El campo Rol Id debe ser un número entero positivo'),

    check('idEstados')
        .exists().withMessage('El campo Id Estdos es requerido')
        .isInt({ gt: 0 }).withMessage('El campo Rol Id debe ser un número entero positivo'),

    check('correoElectronico')
        .not().isEmpty().withMessage('El correo electronico es obligatorio')
        .isEmail().withMessage('El correo electronico no es válido')
        .isLength({ min: 4 }).withMessage('El correo debe tener al menos 4 caracteres')
        .isLength({ max: 50 }).withMessage('El nombre comercial no puede tener más de 50 caracteres'),

    check("nombreCompleto")
        .not().isEmpty().withMessage('El nombre es necesario')
        .isLength({min: 5, max: 75 }).withMessage('El nombre debe contener al menos 5 caracteres'),


    check('password')
        .not().isEmpty().withMessage('El campo contraseña es requerido')
        .isLength({ min: 8}).withMessage('La contraseña debe tener al menos 3 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[@$!%*?&#]/).withMessage('La contraseña debe contener al menos un carácter especial (@$!%*?&#)'),

    check('telefono')
        .not().isEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^[\d\s+-]+$/).withMessage('El teléfono debe contener solo números, espacios o el símbolo +')
        .isLength({ min: 7, max: 45 }).withMessage('El teléfono debe tener entre 7 y 45 caracteres'),

    check('fechaNacimiento')
        .isISO8601().withMessage('La fecha de creación debe tener un formato válido')
        .not().isEmpty().withMessage('La fecha de creación es obligatoria'),

    check('Clientes_idClientes')
        .exists().withMessage('El campo cliente id es requerido')
        .isInt({ gt: 0 }).withMessage('El campo Cliente Id debe ser un número entero positivo'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const validateUpdateUsuario = [
  check('rol_idrol')
      .exists().withMessage('El campo Rol Id es requerido')
      .isInt({ gt: 0 }).withMessage('El campo Rol Id debe ser un número entero positivo'),

  check('idEstados')
      .exists().withMessage('El campo Id Estdos es requerido')
      .isInt({ gt: 0 }).withMessage('El campo Rol Id debe ser un número entero positivo'),

  check('correoElectronico')
      .not().isEmpty().withMessage('El correo electronico es obligatorio')
      .isEmail().withMessage('El correo electronico no es válido')
      .isLength({ min: 4 }).withMessage('El correo debe tener al menos 4 caracteres')
      .isLength({ max: 50 }).withMessage('El nombre comercial no puede tener más de 50 caracteres'),

  check("nombreCompleto")
      .not().isEmpty().withMessage('El nombre es necesario')
      .isLength({min: 5, max: 75}).withMessage('El nombre debe contener al menos 5 caracteres y maximo 75'),

  check('password')
      .not().isEmpty().withMessage('El campo contraseña es requerido')
      .isLength({ min: 8}).withMessage('La contraseña debe tener al menos 3 caracteres')
      .isLength({ max: 145 }).withMessage('El nombre comercial no puede tener más de 45 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
      .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
      .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
      .matches(/[@$!%*?&#]/).withMessage('La contraseña debe contener al menos un carácter especial (@$!%*?&#)'),

  check('telefono')
      .not().isEmpty().withMessage('El teléfono es obligatorio')
      .matches(/^[\d\s+-]+$/).withMessage('El teléfono debe contener solo números, espacios o el símbolo +')
      .isLength({ min: 7, max: 45 }).withMessage('El teléfono debe tener entre 7 y 45 caracteres'),

  check('fechaNacimiento')
      .isISO8601().withMessage('La fecha de creación debe tener un formato válido')
      .not().isEmpty().withMessage('La fecha de creación es obligatoria'),

  check('Clientes_idClientes')
      .exists().withMessage('El campo cliente id es requerido')
      .isInt({ gt: 0 }).withMessage('El campo Cliente Id debe ser un número entero positivo'),

  (req, res, next) => {
    validateResult(req, res, next);
  }
];

module.exports = { validateUsuariosCreate, validateUpdateUsuario };

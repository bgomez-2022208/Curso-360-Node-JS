const router = require("express").Router();
const usuarios = require("../usuarios/usuarios.model");
const rol = require("../rol/rol.model")
const estado = require("../estado/estado.model")
const clientes = require("../clientes/clientes.model");
const bcrypt = require('bcryptjs');
const {validateUsuariosCreate, validateUpdateUsuario} = require('../validators/usuarios.validator')
const jwt = require('jsonwebtoken');
const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const orden = require("../ordenDetalle/orden.model");
const ROLE_ADMIN = parseInt(process.env.ROLE_ADMIN);
const ROLE_USER = parseInt(process.env.ROLE_USER);

const tokenSign = (user) => {
    const secretKey = process.env.SECRET_KEY;
    const payload = {
        idUsuarios: user.idUsuario,
        correoElectronico: user.correoElectronico,
        rol_idrol: user.rol_idrol,
    };

    return jwt.sign(payload, secretKey, {expiresIn: process.env.TIME_EXPIRATION_TOKEN});
};

router.post("/register", async (req, res) => {
    const clientesData = req.body;
    const t = await clientes.sequelize.transaction();
    try {
        const existingClient = await clientes.findOne({where: {email: clientesData.email}});
        if (existingClient) {
            return res.status(400).json({
                ok: false,
                message: "Email already exists for another client"
            });
        }
        const createCliente = await clientes.create({
            razonSocial: clientesData.razonSocial,
            nombreComercial: clientesData.nombreComercial,
            direccionEntrega: clientesData.direccionEntrega,
            telefono: clientesData.telefono,
            email: clientesData.email
        }, {transaction: t});

        const defaultRole = await rol.findOne({where: {nombre: process.env.DEFAULT_ROLE}});
        console.log('Rol:', defaultRole);

        const defaultEstado = await estado.findOne({where: {nombre: process.env.DEFAULT_STATUS}});
        console.log('Estado:', defaultEstado);


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clientesData.password, salt);
        console.log("Datos recibidos: ", clientesData);
        const createUser = await usuarios.create({

            rol_idrol: defaultRole.idRol,
            estados_idestados: defaultEstado.idEstado,
            correoElectronico: clientesData.email,
            nombreCompleto: clientesData.nombreCompleto,
            passwordUsuario: hashedPassword,
            telefonoUsuario: clientesData.telefono,
            fechaNacimiento: clientesData.fechaNacimiento,
            fechaCreacion: new Date(),
            clientes_idClientes: createCliente.idCliente
        }, {transaction: t});

        await t.commit();

        res.status(201).json({
            ok: true,
            data: {cliente: createCliente, usuario: createUser}
        });

    } catch (error) {
        await t.rollback();

        let errorMessage = error.message;
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = "Duplicate entry error: " + error.errors.map(e => e.message).join(', ');
        }

        console.log("Error details:", error);
        res.status(500).json({
            ok: false,
            message: "Error creating client and user",
            error: errorMessage
        });
    }
});

router.put("/editarCliente/:idUsuario", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), async (req, res) => {
    const idUsuario = req.params.idUsuario;
    const clientesData = req.body;
    const t = await clientes.sequelize.transaction();

    try {
        const existingUser = await usuarios.findByPk(idUsuario);
        if (!existingUser) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        const idCliente = existingUser.clientes_idClientes;
        const existingClient = await clientes.findByPk(idCliente);
        if (!existingClient) {
            return res.status(404).json({
                ok: false,
                message: "Client not found"
            });
        }

        await clientes.update({
            razonSocial: clientesData.razonSocial,
            nombreComercial: clientesData.nombreComercial,
            direccionEntrega: clientesData.direccionEntrega,
            telefono: clientesData.telefono,
            email: clientesData.email
        }, {
            where: {idCliente: idCliente},
            transaction: t
        });

        let hashedPassword;
        if (clientesData.password.startsWith('$2a$')) {
            hashedPassword = clientesData.password;
        } else {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(clientesData.password, salt);
        }

        await usuarios.update({
            estados_idestados: clientesData.idEstados,
            correoElectronico: clientesData.email,
            nombreCompleto: clientesData.nombreCompleto,
            passwordUsuario: hashedPassword,
            telefonoUsuario: clientesData.telefono,
            fechaNacimiento: clientesData.fechaNacimiento
        }, {
            where: {idUsuarios: idUsuario},
            transaction: t
        });

        await t.commit();

        res.status(200).json({
            ok: true,
            message: "Client and user updated successfully"
        });

    } catch (error) {
        await t.rollback();

        let errorMessage = error.message;
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = "Duplicate entry error: " + error.errors.map(e => e.message).join(', ');
        }

        console.log("Error details:", error);
        res.status(500).json({
            ok: false,
            message: "Error updating client and user",
            error: errorMessage
        });
    }
});

router.post("/usuarios", validateUsuariosCreate, async (req, res) => {
    try {
        const usuariosData = req.body;
        const currentDate = new Date();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuariosData.password, salt);

        const createUsuarios = await usuarios.create({
            rol_idrol: 1,
            estados_idestados: 1,
            correoElectronico: usuariosData.correoElectronico,
            nombreCompleto: usuariosData.nombreCompleto,
            passwordUsuario: hashedPassword,
            telefonoUsuario: usuariosData.telefono,
            fechaNacimiento: usuariosData.fechaNacimiento,
            fechaCreacion: currentDate,
        });

        res.status(201).json({
            message: "Usuario creado exitosamente",
            data: createUsuarios
        });

    } catch (error) {
        let errorMessage = error.message;
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = "Duplicate entry error: " + error.errors.map(e => e.message).join(', ');
        }
        console.error("Error al crear el usuario:", error);
        res.status(500).json({
            message: "Hubo un error al crear el usuario",
            error: errorMessage
        });
    }
});

router.put("/usuarios/:idUsuario", validateUpdateUsuario, verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), async (req, res) => {
    const idusuarios = req.params.idUsuario;
    const usuariosData = req.body;

    let hashedPassword;
    if (usuariosData.password.startsWith('$2a$')) {
        hashedPassword = usuariosData.password;
    } else {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(usuariosData.password, salt);
    }

    const updateUsuarios = await usuarios.update({
        estados_idestados: usuariosData.idEstados,
        nombreCompleto: usuariosData.nombreCompleto,
        passwordUsuario: hashedPassword,
        telefonoUsuario: usuariosData.telefono,
        fechaNacimiento: usuariosData.fechaNacimiento,
    }, {
        where: {
            idUsuarios: idusuarios
        }
    });

    res.status(200).json({
        message: "Usuarios Actualizado",
        body: updateUsuarios
    });
});

router.post("/login", async (req, res) => {
    const {correoElectronico, passwordUsuario} = req.body;

    if (!correoElectronico || !passwordUsuario) {
        return res.status(400).send({message: 'El correo electrónico y la contraseña son requeridos'});
    }
    try {
        const user = await usuarios.findOne({where: {correo_electronico: correoElectronico}});

        if (!user) {
            return res.status(404).send({message: 'Usuario no encontrado'});
        }

        const isPasswordValid = await bcrypt.compare(passwordUsuario, user.passwordUsuario);


        if (!isPasswordValid) {
            return res.status(401).send({message: 'Contraseña incorrecta'});
        }

        if (user.estados_idestados !== 1) {
            return res.status(401).send({message: 'Usuario no activo'});
        }

        const tokenSession = tokenSign(user);
        res.status(200).json({
            message: "Login exitoso",
            token: tokenSession
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error en el servidor'});
    }
});

router.get('/usuarios/:idUsuarios', async (req, res) => {
    const idUsuarios = req.params.idUsuarios;

    console.log('ID recibido del frontend:', idUsuarios);

    try {
        const usuario = await usuarios.findOne({
            where: {idusuarios: idUsuarios},
            include: {
                model: clientes,
                as: 'cliente',
                attributes: ['razon_social', 'nombre_comercial', 'direccion_entrega', 'telefono', 'email'],
            },
        });

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

router.get('/usuarios', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const usuariosList = await usuarios.findAll({
            include: [
                {
                    model: clientes,
                    as: 'cliente',
                    attributes: ['razonSocial', 'nombreComercial', 'direccionEntrega', 'telefono', 'email'],
                },
                {
                    model: rol,
                    as: 'rol',
                    attributes: ['nombreRol'],
                },
                {
                    model: estado,
                    as: 'estado',
                    attributes: ['nombreEstado'],
                }
            ],
            limit: limit,
            offset: offset,
        });

        if (!usuariosList || usuariosList.length === 0) {
            return res.status(404).json({
                message: "No se encontraron usuarios"
            });
        }

        const totalUsuarios = await usuarios.count();

        res.status(200).json({
            message: "Usuarios obtenidos exitosamente.",
            usuarios: usuariosList,
            pagination: {
                total: totalUsuarios,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(totalUsuarios / pageSize),
            },
        });
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
});
module.exports = router;

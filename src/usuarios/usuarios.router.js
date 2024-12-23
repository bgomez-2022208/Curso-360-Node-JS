const router = require("express").Router();
const usuarios = require("../usuarios/usuarios.model");
const bcrypt = require('bcryptjs');
const { validateUsuariosCreate, validateUpdateUsuario} = require('../validators/usuarios.validator')
const jwt = require('jsonwebtoken');
const {verifyToken, verifyRole} = require("../middleware/roleAuth");

const tokenSign = (user) => {
    const secretKey = process.env.SECRET_KEY;
    const payload = {
        idUsuarios: user.idUsuarios,
        correoElectronico: user.correoElectronico,
        rol_idrol: user.rol_idrol,
    };

    return jwt.sign(payload, secretKey, {expiresIn: '1h'});
};

router.post("/usuarios", validateUsuariosCreate, async (req, res) => {
    try {
        const usuariosData = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuariosData.password, salt);

        const createUsuarios = await usuarios.create({
            rol_idrol: usuariosData.rol_idrol,
            estados_idestados: usuariosData.idEstados,
            correoElectronico: usuariosData.correoElectronico,
            nombreCompleto: usuariosData.nombreCompleto,
            passwordUsuario: hashedPassword,
            telefonoUsuario: usuariosData.telefono,
            fechaNacimiento: usuariosData.fechaNacimiento,
            fechaCreacion: new Date(),
            Clientes_idClientes: usuariosData.Clientes_idClientes
        });

        res.status(201).json({
            message: "Usuario creado exitosamente",
            data: createUsuarios
        });

    } catch (error) {
        let errorMessage = error.message;
        if(error.name === 'SequelizeUniqueConstraintError'){
            errorMessage = "Duplicate entry error: " + error.errors.map(e => e.message).join(', ');
        }
        console.error("Error al crear el usuario:", error);
        res.status(500).json({
            message: "Hubo un error al crear el usuario",
            error: errorMessage
        });
    }
});



router.put("/usuarios/:idUsuario", verifyToken, verifyRole([1, 2]), validateUsuariosCreate, async (req, res) => {
    const idusuarios = req.params.idUsuario;
    const usuariosData = req.body;

    const updateUsuarios = await usuarios.update({
        rol_idrol: usuariosData.rol_idrol,
        estados_idestados: usuariosData.idEstado,
        correoElectronico: usuariosData.correoElectronico,
        nombreCompleto: usuariosData.nombreCompleto,
        passwordUsuario: usuariosData.password,
        telefonoUsuario: usuariosData.telefono,
        fechaNacimiento: usuariosData.fechaNacimiento,
        Clientes_idClientes: usuariosData.Clientes_idClientes
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
    const { correoElectronico, passwordUsuario } = req.body;

    if (!correoElectronico || !passwordUsuario) {
        return res.status(400).send({ message: 'El correo electrónico y la contraseña son requeridos' });
    }
    try {
        const user = await usuarios.findOne({ where: { correo_electronico: correoElectronico } });

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(passwordUsuario, user.passwordUsuario);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Contraseña incorrecta' });
        }
        const tokenSession = tokenSign(user);
        res.status(200).json({
            message: "Login exitoso",
            token: tokenSession
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error en el servidor' });
    }
});


module.exports = router;

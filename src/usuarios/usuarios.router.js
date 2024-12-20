const router = require("express").Router();
const usuarios = require("../usuarios/usuarios.model");
const { where } = require("sequelize");

router.post("/usuarios", async (req, res) => {
    try {
        const usuariosData = req.body;

        const createUsuarios = await usuarios.create({
            rol_idrol: usuariosData.rol_idrol,
            estados_idestados: usuariosData.estados_idestados,
            correoElectronico: usuariosData.correo_electronico,
            nombreCompleto: usuariosData.nombre_completo,
            passwordUsuario: usuariosData.password,
            telefonoUsuario: usuariosData.telefono,
            fechaNacimiento: usuariosData.fecha_nacimiento,
            fechaCreacion: usuariosData.fecha_creacion,
            Clientes_idClientes: usuariosData.Clientes_idClientes
        });

        res.status(201).json({
            message: "Usuario creado exitosamente",
            data: createUsuarios
        });

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({
            message: "Hubo un error al crear el usuario",
            error: error.message
        });
    }
});


router.put("/usuarios/:usuarios_id", async (req, res) => {
    const idusuarios = req.params.usuarios_id;
    const usuariosData = req.body;

    const updateUsuarios = await usuarios.update({
        rol_idrol: usuariosData.rol_idrol,
        estados_idestados: usuariosData.estados_idestados,
        correoElectronico: usuariosData.correo_electronico,
        nombreCompleto: usuariosData.nombre_completo,
        passwordUsuario: usuariosData.password,
        telefonoUsuario: usuariosData.telefono,
        fechaNacimiento: usuariosData.fecha_nacimiento,
        fechaCreacion: usuariosData.fecha_creacion,
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


module.exports = router;

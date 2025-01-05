const router = require ("express").Router()
const { verifyToken, verifyRole } = require('../middleware/roleAuth');
const rol = require("../rol/rol.model")
const { validateCreate, validateUpdate } = require('../validators/estado.validator');
const ROLE_ADMIN = parseInt(process.env.ROLE_ADMIN);
const ROLE_USER = parseInt(process.env.ROLE_USER);

router.post("/rol", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), async (req, res) => {
    const rolData = req.body;
    try {
        const createRol = await rol.create({
            nombreRol: rolData.name
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Rol creado",
            data: createRol
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al crear el rol",
            error: error.message
        });
    }
});



router.put("/rol/:rol_id", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), async (req, res) => {
    const idrol = req.params.rol_id;
    const rolData = req.body;
    try {
        const updateRol = await rol.update({
            nombreRol: rolData.nombre
        }, {
            where: {
                idRol: idrol,
            },
        });
        if (updateRol[0] === 0) {
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "No se realizaron cambios en el rol",
            });
        }
        res.status(200).json({
            ok: true,
            status: 200,
            message: "Rol actualizado",
            data: updateRol
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al actualizar el rol",
            error: error.message
        });
    }
});



module.exports = router;
const router = require("express").Router()
const { verifyToken, verifyRole } = require('../middleware/roleAuth');
const { validateCreate, validateUpdate } = require('../validators/estado.validator');
const estado = require("../estado/estado.model")
const ROLE_ADMIN = parseInt(process.env.ROLE_ADMIN);
const ROLE_USER = parseInt(process.env.ROLE_USER);

router.post('/estate', verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), validateCreate, async (req, res) => {
    const estadoData = req.body;
    try {
        const createEstado = await estado.create({
            nombreEstado: estadoData.name
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Estado Creado",
            data: createEstado
        });
    } catch (error) {
        console.error('Error creating estado:', error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al crear el estado",
            error: error.message
        });
    }
});

router.put("/estate/:idEstado", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), validateUpdate, async (req, res) => {
    const idEstados = req.params.idEstado;
    const estadoData = req.body;
    try {
        const existingEstado = await estado.findOne({
            where: {
                idEstado: idEstados,
            },
        });

        if (!existingEstado) {
            return res.status(404).json({
                message: "Estado no encontrado",
            });
        }
        const updateEstado = await estado.update(
            {
                nombreEstado: estadoData.name,
            },
            {
                where: {
                    idEstado: idEstados,
                },
            }
        );
        res.status(200).json({
            message: updateEstado[0] === 0 ? "No hubo cambios en el registro" : "Estado actualizado",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el estado",
            error: error.message,
        });
    }
});

router.get("/estados", async (req, res) => {
    try {
        const estados = await estado.findAll();
        res.status(200).json(estados);
    } catch (error) {
        console.error("Error al obtener los estados:", error);
        res.status(500).json({
            message: "Hubo un error al obtener los estados",
            error: error.message
        });
    }
});

module.exports = router;
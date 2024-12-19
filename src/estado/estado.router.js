const router = require("express").Router()

const {faker} = require("@faker-js/faker")

const estado = require("../estado/estado.model")

function validateEstadoData(data) {
    if (!data.nombre) {
        throw new Error("The 'nombre' field is required.");
    }
}

router.post("/estate", async (req, res) => {
    await estado.sync()
    const estadoData = req.body;
    console.log('name is: ', estadoData)

    try {
        validateEstadoData(estadoData);
        const createEstado = await estado.create({
            nombreEstado: estadoData.nombre
        })
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Estado Creado",
            data: createEstado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al crear el estado",
            error: error.message
        });
    }
});

router.put("/estate/:estado_id", async (req, res) => {
    const idestados = req.params.estado_id
    const estadoData = req.body;
    const updateEstado = await estado.update({
        nombreEstado: estadoData.nombre
        }, {
            where: {
                idEstado: idestados,
            },
        }
    );
    res.status(200).json({
        message: "Estado actualizado",
        body: updateEstado
    })
})

module.exports = router;
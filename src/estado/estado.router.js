const router = require ("express").Router()

const {faker} = require("@faker-js/faker")

const estado = require("../estado/estado.model")

router.post("/estate", async (req,res) => {
    await estado.sync()
    const estadoData = req.body;
    console.log('name is: ', estadoData)
    const createEstado = await estado.create({
        nombre: estadoData.nombre
    })
    res.status(200).json({
        ok: true,
        status: 201,
        message: "Created Estate",
        data: createEstado
    })
});

router.put("/estate/:estado_id", async (req,res) => {
    const idestados = req.params.estado_id
    const estadoData = req.body;
    const updateEstado = await estado.update({
        nombre: estadoData.nombre
    },{
        where: {
            idestados: idestados,
        },
    }
    );
    res.status(200).json({
        ok: true,
        status: 200,
        body: updateEstado
    })
})

module.exports = router;
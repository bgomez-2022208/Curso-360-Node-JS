const router = require("express").Router();
const Clientes = require("../clientes/clientes.model");
const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const { validateClientesCreate, validateClientesUpdate } = require('../validators/clientes.validator');


router.post("/clientes", verifyToken, verifyRole([1, 2]), validateClientesCreate, async (req, res) => {
    await Clientes.sync();
    const clientesData = req.body;
    try {
        const createCliente = await Clientes.create({
            razonSocial: clientesData.razonSocial,
            nombreComercial: clientesData.nombreComercial,
            direccionEntrega: clientesData.direccionEntrega,
            telefono: clientesData.telefono,
            email: clientesData.email
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Created Client",
            data: createCliente
        });
    } catch (error) {
        let errorMessage = error.message;
        if(error.name === 'SequelizeUniqueConstraintError'){
            errorMessage = "Duplicate entry error: " + error.errors.map(e => e.message).join(', ');
        }

        console.log("texto de prueba para localizar", error)
        res.status(500).json({
            ok: false,
            message: "Error creating client",
            error: errorMessage
        });
    }
});

router.put("/clientes/:idCliente", verifyToken, verifyRole([1, 2]), validateClientesUpdate, async (req, res) => {
    const idcliente = req.params.idCliente;
    const clientesData = req.body;
    try {
        const updateCliente = await Clientes.update({
            razonSocial: clientesData.razonSocial,
            nombreComercial: clientesData.nombreComercial,
            direccionEntrega: clientesData.direccionEntrega,
            telefono: clientesData.telefono,
            email: clientesData.email
        }, {
            where: {
                idcliente: idcliente,
            },
        });
        res.status(200).json({
            message: "Cliente actualizado",
            body: updateCliente
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating client",
            error: error.message
        });
    }
});

router.get("/clientes/:idCliente", verifyToken, verifyRole([1, 2]), async (req, res) => {
    const idcliente = req.params.idCliente;
    try {
        const cliente = await Clientes.findOne({
            where: {
                idcliente: idcliente,
            },
        });
        if (!cliente) {
            return res.status(404).json({
                message: "Cliente no encontrado",
            });
        }
        res.status(200).json({
            message: "Cliente encontrado",
            body: cliente
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching client",
            error: error.message
        });
    }
});


module.exports = router;
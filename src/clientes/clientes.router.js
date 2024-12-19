// src/clientes/clientes.router.js
const router = require("express").Router();
const { faker } = require("@faker-js/faker");
const Clientes = require("../clientes/clientes.model");

router.post("/clientes", async (req, res) => {
    await Clientes.sync();
    const clientesData = req.body;
    try {
        const createCliente = await Clientes.create({
            razonSocial: clientesData.razon_social,
            nombreComercial: clientesData.nombre_comercial,
            direccionEntrega: clientesData.direccion_entrega,
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
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error creating client",
            error: error.message
        });
    }
});

router.put("/clientes/:id_cliente", async (req, res) => {
    const idcliente = req.params.id_cliente;
    const clientesData = req.body;
    try {
        const updateCliente = await Clientes.update({
            razonSocial: clientesData.razon_social,
            nombreComercial: clientesData.nombre_comercial,
            direccionEntrega: clientesData.direccion_entrega,
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

module.exports = router;
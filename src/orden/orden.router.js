const router = require("express").Router();
const orden = require("../orden/orden.model");
const { where } = require("sequelize");

router.post("/orden", async (req, res) => {
    try {
        const ordenData = req.body;
        console.log(ordenData)
        const createOrden = await orden.create({
            idUsuarios: ordenData.usuarios_idusuarios,
            idEstados: ordenData.estados_idestados,
            fechaCreacion: ordenData.fechaEntrega,
            nombreCompleto: ordenData.nombreCompleto,
            ordenDireccion: ordenData.ordenDireccion,
            ordenTelefono: ordenData.ordenTelefono,
            correoElectronico: ordenData.correoElectronico,
            totalOrden: ordenData.totalOrden
        });

        res.status(201).json({
            message: "Orden creada exitosamente",
            data: createOrden
        });

    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({
            message: "Hubo un error al crear la orden",
            error: error.message
        });
    }
});

router.put("/orden/:idOrden", async (req, res) => {
    try {
        const idOrden = req.params.idOrden;
        const ordenData = req.body;

        const updateOrden = await orden.update({
            usuarios_idusuarios: ordenData.usuarios_idusuarios,
            estados_idestados: ordenData.estados_idestados,
            nombreCompleto: ordenData.nombreCompleto,
            ordenDireccion: ordenData.ordenDireccion,
            ordenTelefono: ordenData.ordenTelefono,
            correoElectronico: ordenData.correoElectronico,
            fechaEntrega: ordenData.fechaEntrega,
            totalOrden: ordenData.totalOrden
        }, {
            where: {
                idOrden: idOrden
            }
        });

        if (updateOrden[0] === 0) {
            return res.status(404).json({
                message: "Orden no encontrada"
            });
        }

        res.status(200).json({
            message: "Orden actualizada exitosamente",
            data: ordenData
        });

    } catch (error) {
        console.error("Error al actualizar la orden:", error);
        res.status(500).json({
            message: "Hubo un error al actualizar la orden",
            error: error.message
        });
    }
});

module.exports = router;
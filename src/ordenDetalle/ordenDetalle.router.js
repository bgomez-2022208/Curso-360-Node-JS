const express = require('express');
const router = express.Router();
const ordenDetalle = require('../ordenDetalle/ordenDetalle.model');

router.post("/ordenDetalle", async (req, res) => {
    try {
        const detalleData = req.body;

        const nuevoDetalle = await ordenDetalle.create({
            idOrden: detalleData.idOrden,
            idProducto: detalleData.idProducto,
            cantidadDetalle: detalleData.cantidadDetalle,
            precioDetalle: detalleData.precioDetalle,
            subTotalDetalle: detalleData.subTotalDetalle
        });

        res.status(201).json({
            message: "Detalle de orden creado exitosamente",
            data: nuevoDetalle
        });
    } catch (error) {
        console.error("Error al crear el detalle de orden:", error);
        res.status(500).json({
            message: "Hubo un error al crear el detalle de orden",
            error: error.message
        });
    }
});

router.put("/ordenDetalles/:idOrdenDetalle", async (req, res) => {
    const { idOrdenDetalle } = req.params;
    const ordenDetalleData = req.body;

    try {
        // Actualizar el detalle de la orden
        const ordenDetalleActualizado = await ordenDetalle.update({
            idOrden: ordenDetalleData.idOrden,
            idProducto: ordenDetalleData.idProducto,
            cantidadDetalle: ordenDetalleData.cantidadDetalle,
            precioDetalle: ordenDetalleData.precioDetalle,
            subTotalDetalle: ordenDetalleData.subTotalDetalle
        }, {
            where: {
                idOrdenDetalles: idOrdenDetalle
            }
        });

        if (ordenDetalleActualizado[0] === 0) {
            return res.status(404).json({
                message: "Detalle de orden no encontrado",
            });
        }

        res.status(200).json({
            message: "Detalle de orden actualizado exitosamente",
            data: ordenDetalleActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el detalle de orden:", error);
        res.status(500).json({
            message: "Hubo un error al actualizar el detalle de la orden",
            error: error.message
        });
    }
});

module.exports = router;
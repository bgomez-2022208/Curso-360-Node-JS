const router = require("express").Router();
const ordenDetalle = require('../ordenDetalle/ordenDetalle.model');
const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const { validateCreateOrdenDetalle, validateUpdateOrdenDetalle } = require('../validators/ordenDetalles.validator');


router.post("/ordenDetalle", verifyToken, verifyRole([1, 2]), validateCreateOrdenDetalle, async (req, res) => {
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

router.put("/ordenDetalle/:idOrden", verifyToken, verifyRole([1, 2]), validateUpdateOrdenDetalle, async (req, res) => {
    const idOrdenDetalle = req.params.idOrden;
    const ordenDetalleData = req.body;

    try {
        const updateDetalle = await ordenDetalle.update({
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

        if (updateDetalle[0] === 0) {
            return res.status(404).json({
                message: "Detalle de orden no encontrado",
            });
        }

        res.status(200).json({
            message: "Detalle de orden actualizado exitosamente",
            data: updateDetalle
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
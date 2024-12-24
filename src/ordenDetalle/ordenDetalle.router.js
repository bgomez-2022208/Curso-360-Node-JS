const router = require("express").Router();
const ordenDetalle = require('../ordenDetalle/ordenDetalle.model');
const orden = require("../orden/orden.model");
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


router.post(
    "/ordenPruebaMaster",
    verifyToken,
    verifyRole([1, 2]), // Permitir roles específicos
    async (req, res) => {
        const t = await orden.sequelize.transaction(); // Inicia una transacción

        try {
            const {
                usuarios_idusuarios,
                estados_idestados,
                nombreCompleto,
                ordenDireccion,
                ordenTelefono,
                correoElectronico,
                fechaEntrega,
                totalOrden,
                detalle, // Array con los detalles
            } = req.body;

            // Validar que los detalles no estén vacíos
            if (!detalle || !Array.isArray(detalle) || detalle.length === 0) {
                return res.status(400).json({
                    message: "Debe proporcionar al menos un detalle para la orden.",
                });
            }

            // Crear la orden principal
            const nuevaOrden = await orden.create(
                {
                    idUsuarios: usuarios_idusuarios,
                    idEstados: estados_idestados,
                    nombreCompleto,
                    ordenDireccion,
                    ordenTelefono,
                    correoElectronico,
                    fechaEntrega,
                    totalOrden,
                },
                { transaction: t }
            );

            // Obtener el ID generado de la orden
            const idOrden = nuevaOrden.idOrden;

            // Preparar los detalles de la orden
            const detalles = detalle.map((det) => {
                if (!det.idProducto || !det.cantidadDetalle || !det.precioDetalle || !det.subTotalDetalle) {
                    throw new Error("Datos incompletos en los detalles de la orden.");
                }

                return {
                    idOrden: idOrden,
                    idProducto: det.idProducto,
                    cantidadDetalle: det.cantidadDetalle,
                    precioDetalle: det.precioDetalle,
                    subTotalDetalle: det.subTotalDetalle,
                };
            });

            // Insertar los detalles en la tabla OrdenDetalles
            await ordenDetalle.bulkCreate(detalles, { transaction: t });

            // Confirmar la transacción
            await t.commit();

            // Responder con éxito
            res.status(201).json({
                message: "Orden y detalles creados exitosamente.",
                orden: nuevaOrden,
                detalles,
            });
        } catch (error) {
            // Revertir la transacción en caso de error
            await t.rollback();
            console.error("Error al crear la orden y sus detalles:", error);

            res.status(500).json({
                message: "Hubo un error al crear la orden.",
                error: error.message,
            });
        }
    }
);


module.exports = router;
const router = require("express").Router();
const ordenDetalle = require('../ordenDetalle/ordenDetalle.model');
const orden = require("./orden.model");
const productos = require("../productos/productos.model");

const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const { validateOrdenCreate } = require('../validators/orden.validator');


router.put("/orden/:idOrden", verifyToken, verifyRole([1, 2]), async (req, res) => {
    const { idOrden } = req.params;
    const { idEstados } = req.body;

    try {
        const ordenExistente = await orden.findByPk(idOrden);

        if (!ordenExistente) {
            return res.status(404).json({
                message: "Orden no encontrada",
            });
        }

        await ordenExistente.update({ idEstados });

        res.status(200).json({
            message: "Estado de la orden actualizado correctamente",
            orden: ordenExistente,
        });
    } catch (error) {
        console.error("Error al actualizar el estado de la orden:", error);
        res.status(500).json({
            message: "Hubo un error al actualizar el estado de la orden.",
            error: error.message,
        });
    }
});

router.post("/ordenDetalle", verifyToken, verifyRole([1, 2]), validateOrdenCreate,
    async (req, res) => {
        const t = await orden.sequelize.transaction();

        try {
            const { usuarios_idusuarios,
                estados_idestados,
                nombreCompleto,
                ordenDireccion,
                ordenTelefono,
                correoElectronico,
                fechaEntrega,
                totalOrden,
                detalle } = req.body;

            if (!Array.isArray(detalle) || detalle.length === 0) {
                return res.status(400).json({ message: "Debe proporcionar al menos un detalle para la orden." });
            }

            const nuevaOrden = await orden.create(
                {
                    idUsuarios: usuarios_idusuarios,
                    idEstados: estados_idestados,
                    nombreCompleto,
                    ordenDireccion,
                    ordenTelefono,
                    correoElectronico,
                    fechaEntrega,
                    totalOrden
                },
                { transaction: t }
            );

            const detalles = detalle.map(det => ({
                idOrden: nuevaOrden.idOrden,
                ...det
            }));

            await ordenDetalle.bulkCreate(detalles, { transaction: t });

            for (const det of detalle) {
                const producto = await productos.findByPk(det.idProducto, { transaction: t });

                if (!producto) {
                    throw new Error(`El producto con ID ${det.idProducto} no existe.`);
                }

                if (parseFloat(producto.stockProducto) < det.cantidadDetalle) {
                    throw new Error(`El producto con ID ${det.idProducto} no tiene suficiente stock.`);
                }

                const nuevoStock = parseFloat(producto.stockProducto) - det.cantidadDetalle;
                await producto.update(
                    { stockProducto: nuevoStock.toString() },
                    { transaction: t }
                );
            }

            await t.commit();
            res.status(201).json({
                message: "Orden y detalles creados exitosamente.",
                orden: nuevaOrden,
                detalles
            });
        } catch (error) {
            await t.rollback();
            console.error("Error al crear la orden y detalles:", error);
            res.status(500).json({
                message: "Hubo un error al crear la orden.",
                error: error.message
            });
        }
    }
);


module.exports = router;
const router = require("express").Router();
const ordenDetalle = require('../ordenDetalle/ordenDetalle.model');
const orden = require("./orden.model");
const productos = require("../productos/productos.model");

const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const { validateOrdenCreate } = require('../validators/orden.validator');
const {or} = require("sequelize");
const ROLE_ADMIN = parseInt(process.env.ROLE_ADMIN);
const ROLE_USER = parseInt(process.env.ROLE_USER);

router.put("/orden/:idOrden", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), async (req, res) => {
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

router.post("/ordenDetalle", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), validateOrdenCreate,
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

router.get(
    "/orden",
    verifyToken,
    async (req, res) => {
        try {
            const { rol_idrol, id } = req.user;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const offset = (page - 1) * pageSize;
            const limit = pageSize;

            const whereCondition = rol_idrol === 2 ? { idUsuarios: id } : {};

            console.log("Condición WHERE:", whereCondition);

            const ordenes = await orden.findAll({
                where: whereCondition,
                include: [
                    {
                        model: ordenDetalle,
                        as: "detalles",
                        include: [
                            {
                                model: productos,
                                as: "producto",
                                attributes: ["nombreProducto", "precioProducto"],
                            },
                        ],
                    },
                ],
                limit: limit,
                offset: offset,
            });

            if (!ordenes || ordenes.length === 0) {
                return res.status(404).json({ message: "No se encontraron órdenes." });
            }

            const totalOrdenes = await orden.count({ where: whereCondition });

            res.status(200).json({
                message: "Órdenes obtenidas exitosamente.",
                ordenes,
                pagination: {
                    total: totalOrdenes,
                    page: page,
                    pageSize: pageSize,
                    totalPages: Math.ceil(totalOrdenes / pageSize),
                },
            });
        } catch (error) {
            console.error("Error al obtener las órdenes:", error);
            res.status(500).json({
                message: "Hubo un error al obtener las órdenes.",
                error: error.message,
            });
        }
    }
);


router.put("/ordenEstado/:idOrden", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), async (req, res) => {
    const { idOrden } = req.params;
    const currentDate = new Date();

    try {
        const ordenExistente = await orden.findByPk(idOrden);

        if (!ordenExistente) {
            return res.status(404).json({
                message: "Orden no encontrada",
            });
        }

        await ordenExistente.update({
            idEstados: 10,
            fechaEntrega: currentDate
        });

        res.status(200).json({
            message: "Estado de la orden y fecha de entrega actualizados correctamente",
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

router.put("/cancelarOrden/:idOrden", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), async (req, res) => {
    const t = await orden.sequelize.transaction();
    try {
        const idOrden = req.params.idOrden;
        if (!idOrden) {
            return res.status(400).json({
                message: 'El id de la orden es requerido',
            });
        }

        const ordenExistente = await orden.findOne({
            where: { idOrden: idOrden },
            include: [{
                model: ordenDetalle,
                as: 'detalles',
                include: [{
                    model: productos,
                    as: 'producto'
                }]
            }],
            transaction: t
        });

        if (!ordenExistente) {
            await t.rollback();
            return res.status(404).json({
                message: 'No se encontró la orden para el id proporcionado',
            });
        }

        await orden.update({
            idEstados: 11
        }, {
            where: { idOrden: idOrden },
            transaction: t
        });

        for (const detalle of ordenExistente.detalles) {
            const producto = await productos.findOne({
                where: { idProductos: detalle.idProducto },
                transaction: t
            });

            if (!producto) {
                throw new Error(`Producto con ID ${detalle.idProducto} no encontrado`);
            }

            const nuevoStock = parseFloat(producto.stockProducto) + parseFloat(detalle.cantidadDetalle);
            console.log(`Actualizando stock del producto ID ${detalle.idProducto}: ${producto.stockProducto} + ${detalle.cantidadDetalle} = ${nuevoStock}`);

            await productos.update({
                stockProducto: nuevoStock.toString(),
            }, {
                where: { idProductos: detalle.idProducto },
                transaction: t
            });
        }

        await t.commit();

        res.status(200).json({
            message: 'Orden cancelada con éxito',
            data: ordenExistente
        });
    } catch (error) {
        await t.rollback();
        console.error('Error al cancelar la orden:', error);
        res.status(500).json({
            message: 'Error al cancelar la orden',
            error: error.message,
        });
    }
});



module.exports = router;
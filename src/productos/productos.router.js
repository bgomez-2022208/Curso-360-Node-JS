const express = require('express');
const router = express.Router();
const productos = require('../productos/productos.model');

router.post("/productos", async (req, res) => {
    try {
        const productoData = req.body;

        const nuevoProducto = await productos.create({
            idCategoriaProductos: productoData.idCategoriaProductos,
            idUsuarios: productoData.idUsuarios,
            nombreProducto: productoData.nombreProducto,
            marcaProducto: productoData.marcaProducto,
            codigoProducto: productoData.codigoProducto,
            stockProducto: productoData.stockProducto,
            estados_idestados: productoData.estados_idestados,
            precioProducto: productoData.precioProducto,
            fechaCreacion: productoData.fechaCreacion,
            fotoProducto: productoData.fotoProducto
        });

        res.status(201).json({
            message: "Producto creado exitosamente",
            data: nuevoProducto
        });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({
            message: "Hubo un error al crear el producto",
            error: error.message
        });
    }
});

router.put("/productos/:idProducto", async (req, res) => {
    const { idProducto } = req.params;
    const productoData = req.body;

    try {
        const productoActualizado = await productos.update({
            idCategoriaProductos: productoData.idCategoriaProductos,
            idUsuarios: productoData.idUsuarios,
            nombreProducto: productoData.nombreProducto,
            marcaProducto: productoData.marcaProducto,
            codigoProducto: productoData.codigoProducto,
            stockProducto: productoData.stockProducto,
            estados_idestados: productoData.estados_idestados,
            precioProducto: productoData.precioProducto,
            fechaCreacion: productoData.fechaCreacion,
            fotoProducto: productoData.fotoProducto
        }, {
            where: {
                idProductos: idProducto
            }
        });

        res.status(200).json({
            message: "Producto actualizado exitosamente",
            data: productoActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({
            message: "Hubo un error al actualizar el producto",
            error: error.message
        });
    }
});

module.exports = router;
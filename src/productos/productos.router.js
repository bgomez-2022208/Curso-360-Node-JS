const router = require("express").Router();
const productos = require("../productos/productos.model");
const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const { validateCreateProducto, validateUpdateProducto } = require('../validators/productos.validator');


router.post("/productos", verifyToken, verifyRole([1, 2]), validateCreateProducto, async (req, res) => {
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
            fotoProducto: productoData.fotoProducto ? Buffer.from(productoData.fotoProducto, 'base64') : null,
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

router.put("/productos/:idProducto", verifyToken, verifyRole([1, 2]), validateUpdateProducto, async (req, res) => {
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
            fotoProducto: productoData.fotoProducto ? Buffer.from(productoData.fotoProducto, 'base64') : null,
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

router.get('/productos', async (req, res) => {
    try {
        const productosList = await productos.findAll();

        const productosConImagenBase64 = productosList.map(producto => {
            const productoJSON = producto.toJSON();
            if (productoJSON.fotoProducto) {
                productoJSON.fotoProducto = productoJSON.fotoProducto.toString('base64');
            }
            return productoJSON;
        });

        res.status(200).json(productosConImagenBase64);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

router.get('/productos', async (req, res) => {
    try {
        const productosList = await productos.findAll();
        const productosConImagenBase64 = productosList.map(producto => {
            return {
                ...producto.toJSON(),
                fotoProducto: producto.fotoProducto ? Buffer.from(producto.fotoProducto).toString('base64' ) : null
            };
        });
        res.status(200).json({
            message: 'productos listados con exito',
            data: productosConImagenBase64
        })
    }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener los productos', error });
        }
});

module.exports = router;
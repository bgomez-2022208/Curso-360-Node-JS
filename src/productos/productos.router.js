const router = require("express").Router();
const productos = require("../productos/productos.model");
const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const categoriaProductos = require("../categoriaProductos/categoriaProductos.model");
const { validateCreateProducto, validateUpdateProducto } = require('../validators/productos.validator');
const ROLE_ADMIN = parseInt(process.env.ROLE_ADMIN);
const ROLE_USER = parseInt(process.env.ROLE_USER);

router.post("/crearProductos", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), validateCreateProducto, async (req, res) => {
    try {
        const productoData = req.body;
        const { id } = req.user;
        const currentDate = new Date();

        const nuevoProducto = await productos.create({
            idCategoriaProductos: productoData.idCategoriaProductos,
            idUsuarios: id,
            nombreProducto: productoData.nombreProducto,
            marcaProducto: productoData.marcaProducto,
            codigoProducto: productoData.codigoProducto,
            stockProducto: productoData.stockProducto,
            estados_idestados: productoData.estados_idestados,
            precioProducto: productoData.precioProducto,
            fechaCreacion: currentDate,
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

router.put("/productos/:idProducto",verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), validateUpdateProducto, async (req, res) => {
    const { idProducto } = req.params;
    const productoData = req.body;
    const { id } = req.user;
    try {
        const productoActualizado = await productos.update({
            idCategoriaProductos: productoData.idCategoriaProductos,
            idUsuarios: id,
            nombreProducto: productoData.nombreProducto,
            marcaProducto: productoData.marcaProducto,
            codigoProducto: productoData.codigoProducto,
            stockProducto: productoData.stockProducto,
            estados_idestados: productoData.estados_idestados,
            precioProducto: productoData.precioProducto,
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


router.get('/Obtenerproductos', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { count, rows: productosList } = await productos.findAndCountAll({
            offset: offset,
            limit: limit,
            include: [{
                model: categoriaProductos,
                attributes: ['nombreCategoriaProducto']
            }]
        });

        const productosConImagenBase64 = productosList.map(producto => {
            const productoJSON = producto.toJSON();
            return {
                ...productoJSON,
                fotoProducto: productoJSON.fotoProducto ? Buffer.from(productoJSON.fotoProducto).toString('base64') : null,
                nombreCategoria: productoJSON.categoriaProducto ? productoJSON.categoriaProducto.nombreCategoriaProducto : null
            };
        });
        res.status(200).json({
            message: 'Productos listados con éxito',
            data: productosConImagenBase64,
            pagination: {
                total: count,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(count / pageSize),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

module.exports = router;
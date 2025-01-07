const router = require("express").Router();
const categoriaProductos = require("../categoriaProductos/categoriaProductos.model");
const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const { validateCategoriaProducto, validateCategoriaProductoUpdate } = require('../validators/categoriaProductos.validator');
const ROLE_ADMIN = parseInt(process.env.ROLE_ADMIN);
const ROLE_USER = parseInt(process.env.ROLE_USER);
const usuarios = require("../usuarios/usuarios.model");



router.post("/categoriaProductos", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), validateCategoriaProducto, async (req, res) => {
    try {
        const currentDate = new Date();
        const categoriaProductosData = req.body;
        const { id } = req.user;
        const createCategoriaProducto = await categoriaProductos.create({
            usuarios_idusuarios: id,
            nombreCategoriaProducto: categoriaProductosData.nombreCategoriaProducto,
            estados_idestados: 1,
            fechaCreacion: currentDate
        });
        res.status(201).json({
            message: "Categoría de producto creada exitosamente",
            data: createCategoriaProducto
        });
    } catch (error) {
        console.error("Error al crear la categoría de producto:", error);
        res.status(500).json({
            message: "Hubo un error al crear la categoría de producto",
            error: error.message
        });
    }
});

router.put("/categoriaProductos/:idCategoriaProductos",  verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), validateCategoriaProductoUpdate, async (req, res) => {
    const idCategoriaProductos = req.params.idCategoriaProductos;
    const categoriaProductosData = req.body;

    try {
        const updateCategoriaProducto = await categoriaProductos.update({
            nombreCategoriaProducto: categoriaProductosData.nombreCategoriaProducto,
            estados_idestados: categoriaProductosData.idEstado,
        }, {
            where: {
                idCategoriaProductos: idCategoriaProductos
            }
        });

        if (updateCategoriaProducto[0] === 0) {
            return res.status(404).json({
                message: "Categoría de producto no encontrada"
            });
        }

        res.status(200).json({
            message: "Categoría de producto actualizada",
            body: updateCategoriaProducto
        });
    } catch (error) {
        console.error("Error al actualizar la categoría de producto:", error);
        res.status(500).json({
            message: "Hubo un error al actualizar la categoría de producto",
            error: error.message
        });
    }
});

router.get("/categorias", async (req, res) => {
    try {
        const categorias = await categoriaProductos.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).json({
            message: "Hubo un error al obtener las categorías",
            error: error.message
        });
    }
});
router.get('/listarCategorias', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const categoriasList = await categoriaProductos.findAll({
            include: [
                {
                    model: usuarios,
                    as: 'usuario',
                    attributes: ['nombreCompleto']
                }
            ],
            limit: limit,
            offset: offset,
        });

        if (!categoriasList || categoriasList.length === 0) {
            return res.status(404).json({
                message: "No se encontraron categorías"
            });
        }

        const totalCategorias = await categoriaProductos.count();

        res.status(200).json({
            message: "Categorías obtenidas exitosamente.",
            categorias: categoriasList,
            pagination: {
                total: totalCategorias,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(totalCategorias / pageSize),
            },
        });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

module.exports = router;
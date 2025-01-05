const router = require("express").Router();
const categoriaProductos = require("../categoriaProductos/categoriaProductos.model");
const {verifyToken, verifyRole} = require("../middleware/roleAuth");
const { validateCategoriaProducto, validateCategoriaProductoUpdate } = require('../validators/categoriaProductos.validator');
const ROLE_ADMIN = parseInt(process.env.ROLE_ADMIN);
const ROLE_USER = parseInt(process.env.ROLE_USER);


router.post("/categoriaProductos", verifyToken, verifyRole([ROLE_ADMIN, ROLE_USER]), validateCategoriaProducto, async (req, res) => {
    try {
        const categoriaProductosData = req.body;
        const createCategoriaProducto = await categoriaProductos.create({
            usuarios_idusuarios: categoriaProductosData.usuarios_idusuarios,
            nombreCategoriaProducto: categoriaProductosData.nombreCategoriaProducto,
            estados_idestados: categoriaProductosData.idEstado,
            fechaCreacion: categoriaProductosData.fechaCreacion
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
            usuarios_idusuarios: categoriaProductosData.usuarios_idusuarios,
            nombreCategoriaProducto: categoriaProductosData.nombreCategoriaProducto,
            estados_idestados: categoriaProductosData.idEstado,
            fechaCreacion: categoriaProductosData.fechaCreacion
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

module.exports = router;
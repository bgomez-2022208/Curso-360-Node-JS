const router = require ("express").Router()

const {faker} = require("@faker-js/faker")

const rol = require("../rol/rol.model")

router.post("/rol", async (req,res) =>{
    await rol.sync()
    const rolData = req.body;

    const createRol = await rol.create({
        nombreRol: rolData.nombre
    })
    res.status(200).json({
        message: "Rol creado",
        data: createRol
    })
});

router.put("/rol/:rol_id", async (req,res) => {
    const idrol = req.params.rol_id
    const rolData = req.body;
    const updateRol = await rol.update({
        nombreRol: rolData.nombre
    }, {
        where: {
            idRol: idrol,
        },
    });
    res.status(200).json( {
        message: "Rol Actualizado",
        body: updateRol
    })
})

module.exports = router;
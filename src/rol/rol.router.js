const router = require ("express").Router()

const {faker} = require("@faker-js/faker")

const rol = require("../rol/rol.model")

router.post("/rol", async (req,res) =>{
    await rol.sync()
    const rolData = req.body;
    console.log('name is: ', rolData)

    const createRol = await rol.create({
        nombre: rolData.nombre
    })
    res.status(200).json({
        ok: true,
        status: 201,
        message: "Created Rol",
        data: createRol
    })
});

router.put("/rol/:rol_id", async (req,res) => {
    const idrol = req.params.rol_id
    const rolData = req.body;
    const updateRol = await rol.update({
        nombre: rolData.nombre
    }, {
        where: {
            idrol: idrol,
        },
    });
    res.status(200).json( {
        ok:true,
        status: 200,
        body: updateRol
    })
})

module.exports = router;
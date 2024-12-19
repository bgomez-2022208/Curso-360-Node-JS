const express = require('express')
const morgan = require("morgan")

const estadoRouter = require("../estado/estado.router")
const rolesRouter = require("../rol/rol.router")
const clientesRouter = require("../clientes/clientes.router")


const app = express()

app.use(morgan("dev"))

app.use(express.json())

app.get("/", (req, res) => {
    res.send('This is my app del curso 360')
})

    app.use("/api/v1", estadoRouter)
    app.use("/api/v1", rolesRouter)
    app.use("/api/v1", clientesRouter)

    module.exports = app;
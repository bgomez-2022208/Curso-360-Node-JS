const express = require('express');
const morgan = require("morgan");

const estadoRouter = require("../estado/estado.router");
const rolesRouter = require("../rol/rol.router");
const clientesRouter = require("../clientes/clientes.router");
const usuariosRouter = require("../usuarios/usuarios.router");
const categoriaProductosRouter = require("../categoriaProductos/categoriaProductos.router");
const ordenRouter = require("../orden/orden.router");
const ProductosRouter = require("../productos/productos.router");
const ordenDetalleRouter = require("../ordenDetalle/ordenDetalle.router");



const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send('This is my app del curso 360');
});

app.use("/api/v1", estadoRouter);
app.use("/api/v1", rolesRouter);
app.use("/api/v1", clientesRouter);
app.use("/api/v1", usuariosRouter);
app.use("/api/v1", categoriaProductosRouter);
app.use("/api/v1", ordenRouter);
app.use("/api/v1", ProductosRouter);
app.use("/api/v1", ordenDetalleRouter);



module.exports = app;
const {Sequelize, Model, DataTypes, STRING} = require("sequelize")

const sequelize = new Sequelize("GDA00138_OT_brandon_gomez", "root", "2006", {
    host: "localhost",
    dialect: "mysql",
    port: 3306
})

class clientes extends Model {
}

clientes.init({
    idCliente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "idcliente"
    },
    razonSocial: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "razon_social"
    },
    nombreComercial: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "nombre_comercial"
    },
    direccionEntrega: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "direccion_entrega"
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "clientes",
    tableName: 'Clientes',
    timestamps: false
})

module.exports = clientes

const {Sequelize, Model, DataTypes} = require("sequelize")

const sequelize = require('../db/mysql');

class productos extends Model {
}

productos.init({
    idProductos: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idCategoriaProductos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "CategoriaProductos",
            key: "idCategoriaProductos"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE',
        field: "CategoriasProductos_idCategoriaProductos"
    },
    idUsuarios: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: "idusuarios"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE',
        field: "usuarios_idusuarios"
    },
    nombreProducto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "nombre"
    },
    marcaProducto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "marca"
    },
    codigoProducto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "codigo"
    },
    stockProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "stock"
    },
    estados_idestados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Estados",
            key: "idestados"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE'
    },
    precioProducto: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "precios"
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fecha_creacion',
        defaultValue: Sequelize.NOW
    },
    fotoProducto: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
        field: "foto"
    },
}, {
    sequelize,
    modelName: "productos",
    tableName: 'Productos',
    timestamps: false
})

module.exports = productos
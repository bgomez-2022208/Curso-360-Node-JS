const {Sequelize, Model, DataTypes, STRING} = require("sequelize")

const sequelize = require('../db/mysql');

class categoriaProductos extends Model {
}

categoriaProductos.init({
    idCategoriaProductos: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "idCategoriaProductos"
    },
    usuarios_idusuarios: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: "idusuarios"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE'
    },
    nombreCategoriaProducto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "nombre"
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
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fecha_creacion',
        defaultValue: Sequelize.NOW
    },
}, {
    sequelize,
    modelName: "categoriaProductos",
    tableName: 'CategoriaProductos',
    timestamps: false
})

module.exports = categoriaProductos

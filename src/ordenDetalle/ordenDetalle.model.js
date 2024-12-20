const {Sequelize, Model, DataTypes, STRING} = require("sequelize")

const sequelize = require('../db/mysql');

class ordenDetalles extends Model {

}

ordenDetalles.init({
    idOrdenDetalles: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idOrden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Orden",
            key: "idOrden"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE',
        field: "Orden_idOrden"
    },
    idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Orden",
            key: "idOrden"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE',
        field: "Productos_idProductos"
    },
    cantidadDetalle: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "cantidad"
    },
    precioDetalle: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "precio"
    },
    subTotalDetalle: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "subtotal"
    },
}, {
    sequelize,
    modelName: "ordenDetalles",
    tableName: 'OrdenDetalles',
    timestamps: false
});

module.exports = ordenDetalles;
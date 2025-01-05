const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../db/mysql');
const ordenDetalle = require('./ordenDetalle.model');

class orden extends Model {}

orden.init({
    idOrden: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "idOrden"
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
    idEstados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Estados",
            key: "idestados"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE',
        field: "estados_idestados"
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fecha_creacion',
        defaultValue: Sequelize.NOW
    },
    nombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "nombre_completo"
    },
    ordenDireccion: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "direccion"
    },
    ordenTelefono: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "telefono"
    },
    correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "correo_electronico"
    },
    fechaEntrega: {
        type: DataTypes.DATE,
        field: "fecha_entrega"
    },
    totalOrden: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "total_orden"
    },
}, {
    sequelize,
    modelName: "orden",
    tableName: 'Orden',
    timestamps: false
});

orden.hasMany(ordenDetalle, {
    foreignKey: 'idOrden',   // La clave foránea en ordenDetalle
    as: 'detalles'           // Alias para la relación
});

module.exports = orden;
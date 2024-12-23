const { Sequelize, Model, DataTypes} = require ("sequelize")

const sequelize = require('../db/mysql');

class usuarios extends Model {}

usuarios.init({
    idUsuarios:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "idusuarios"
    },
    rol_idrol:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rol',
            key: "idrol"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE'
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
    correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "correo_electronico"
    },
    nombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "nombre_completo"
    },
    passwordUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password"
    },
    telefonoUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "telefono"
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "fecha_nacimiento"
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fecha_creacion',
        defaultValue: Sequelize.NOW
    },
    Clientes_idClientes:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Clientes",
            key: "idestados"
        },
        onUpdate: 'CASCADE',
        onDELETE: 'CASCADE'
    },
}, {
    sequelize,
    modelName: "usuarios",
    tableName: 'Usuarios',
    timestamps: false
})

module.exports = usuarios

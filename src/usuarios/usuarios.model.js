const { Model, DataTypes } = require("sequelize");
const sequelize = require('../db/mysql');
const clientes = require('../clientes/clientes.model');

class usuarios extends Model {}

usuarios.init({
    idUsuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "idusuarios"
    },
    rol_idrol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Rol",
            key: "idRol"
        }
    },
    estados_idestados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Estados",
            key: "estados_idestados"
        }
    },
    correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'correo_electronico',
    },
    nombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nombre_completo',
    },
    passwordUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password',
    },
    telefonoUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'telefono',
    },
    fechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'fecha_nacimiento',
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
        field: 'fecha_creacion',
    },
    clientes_idClientes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Clientes",
            key: "idCliente"
        }
    }
}, {
    sequelize,
    modelName: "usuarios",
    tableName: 'Usuarios',
    timestamps: false
});

usuarios.belongsTo(clientes, { foreignKey: 'Clientes_idClientes', as: 'cliente' });

module.exports = usuarios;

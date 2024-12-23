const { Sequelize, Model, DataTypes, STRING} = require ("sequelize")

const sequelize = require('../db/mysql');

class rol extends Model {}

rol.init({
    idRol:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "idrol"
    },
    nombreRol: {
        type: DataTypes.STRING,
        allowNull: false,
        field:"nombre"
    },
},{
    sequelize,
    modelName: "rol",
    tableName: 'Rol',
    timestamps: false
})

module.exports = rol

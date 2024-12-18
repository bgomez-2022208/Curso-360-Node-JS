const { Sequelize, Model, DataTypes, STRING} = require ("sequelize")

const sequelize = new Sequelize("GDA00138_OT_brandon_gomez", "root", "2006", {
    host: "localhost",
    dialect: "mysql",
    port: 3306
})

class rol extends Model {}

rol.init({
    idrol:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    sequelize,
    modelName: "rol",
    tableName: 'Rol',
    timestamps: false
})

module.exports = rol

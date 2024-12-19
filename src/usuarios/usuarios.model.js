const { Sequelize, Model, DataTypes, STRING} = require ("sequelize")

const sequelize = new Sequelize("GDA00138_OT_brandon_gomez", "root", "2006", {
    host: "localhost",
    dialect: "mysql",
    port: 3306
})

class usaurios extends Model {}

usuarios.init({
    idusuarios:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,

    },
    rol_idrol:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    estados_idestados: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo_electronico: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Clientes_idClientes:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
}, {
    sequelize,
    modelName: "usuarios",
    tableName: 'Usuarios',
    timestamps: false
})

module.exports = usaurios

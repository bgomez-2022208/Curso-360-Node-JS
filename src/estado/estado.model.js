const { Sequelize, Model, DataTypes, STRING} = require ("sequelize")

const sequelize = new Sequelize("GDA00138_OT_brandon_gomez", "root", "2006", {
    host: "localhost",
    dialect: "mysql",
    port: 3306
})


class estado extends Model {}

estado.init({
    idEstado: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'idestados'
    },
    nombreEstado: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "nombre"
    },
},{
   sequelize,
   modelName: "estado",
    tableName: 'Estados',
    timestamps: false
})

module.exports = estado
// async function testConection() {
//     try {
//         await sequelize.authenticate();
//         console.log("all Good")
//     } catch (err) {
//         console.log("All bad",err)
//     }
// }

// testConection();
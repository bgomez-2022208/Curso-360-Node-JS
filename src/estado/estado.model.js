const { Sequelize, Model, DataTypes, STRING} = require ("sequelize")

const sequelize = require('../db/mysql');


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
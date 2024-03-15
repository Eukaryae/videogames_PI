const { DataTypes, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('genres', {
    id: {
      // type: DataTypes.INTEGER,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: {
      //   notNull:{
      //     msg: "Valid genre name is required.",
      //   },
      //   notEmpty:{
      //     msg: "Please provide an genre name."
      //   },
      // }
    },
    image_background:{
      type:DataTypes.STRING,
      allowNull: true,
      validate: {
          isUrl: {
              msg : "Please provide a valid URL"
          }
      }
    }
  },{
    timestamps:false,
    frozenTableName: true,
  });
};

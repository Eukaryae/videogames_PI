const { DataTypes, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogames', {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      unique: true, // new
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    image: {
      type: DataTypes.STRING,
      validate:{
        isUrl: true
      }
    },
    image_background: {
      type: DataTypes.STRING,
      validate:{
        isUrl: true
      }
    },
    platforms:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull:{
          msg: "Select at least one option",
        },
        notEmpty:{
          msg: "Please provide the information"
        },
      }
    },
    description: {
      type: DataTypes.TEXT,
    },
    released: {
      type: DataTypes.STRING,

      // type:DataTypes.DATE,
      allowNull: false,
      // validate: {
      //   isDate: true
      // }
    },
    rating:{
      type: DataTypes.FLOAT,
      allowNull: false
    },
    created:{
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }

  },{
      timestamps:false,
      frozenTableName: true,
    });
};

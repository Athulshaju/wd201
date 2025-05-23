'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo,{
        foreignKey: "userId"
      })
    }
  }
  User.init({
    firstName: {type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"First name cannot be null"
        }
      },notEmpty:{
        msg:"First name cannot be empty"
      }
    },
    lastName: DataTypes.STRING,
    email: {type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Email cannot be null"
        }
      },notEmpty:{
        msg:"Email name cannot be empty"
      }
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
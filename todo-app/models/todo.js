'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
const { Op } = Sequelize;
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here

      Todo.belongsTo(models.User,{
        foreignKey:"userId"
      })
    }

    static addTodo({title,dueDate,userId}){
      return this.create({title:title,dueDate:dueDate,completed:false,userId})
    }

    setCompletionStatus(status,userId){
      return this.update({completed:status,userId})
    }

    static overdueTodos(userId){
      return this.findAll({
        where: { dueDate: { [Op.lt]: new Date() }, completed: false,userId }
      })
    }

    static dueTodayTodos(userId){
      return this.findAll({
        where: { dueDate: { [Op.eq]: new Date() },completed: false,userId }
      })
    }

    static dueLaterTodos(userId){
      return this.findAll({
        where: { dueDate: { [Op.gt]: new Date() },completed: false,userId }
      })
    }

    static completedTodos(userId){
      return this.findAll({
        where: { completed: true,userId }
      })
    }

    static getAllTodos(){
      return this.findAll({order:[["id","ASC"]]})
    }

    static async remove(id,userId){
      return this.destroy({
        where: {
          id,
          userId
        }
      }) 
    }


  }
  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: true,
        len: 5
      }
    },
    dueDate: { type: DataTypes.DATEONLY,},
    completed:{type: DataTypes.BOOLEAN,defaultValue: false},
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
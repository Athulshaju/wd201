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

    static addTodo({title,dueDate}){
      return this.create({title:title,dueDate:dueDate,completed:false})
    }

    setCompletionStatus(status){
      return this.update({completed:status})
    }

    static overdueTodos(){
      return this.findAll({
        where: { dueDate: { [Op.lt]: new Date().toISOString().split("T")[0] }, completed: false }
      })
    }

    static dueTodayTodos(){
      return this.findAll({
        where: { dueDate: { [Op.eq]: new Date().toISOString().split("T")[0] },completed: false }
      })
    }

    static dueLaterTodos(){
      return this.findAll({
        where: { dueDate: { [Op.gt]: new Date().toISOString().split("T")[0] },completed: false }
      })
    }

    static completedTodos(){
      return this.findAll({
        where: { completed: true }
      })
    }

    static getAllTodos(){
      return this.findAll({order:[["id","ASC"]]})
    }

    static async remove(id){
      return this.destroy({
        where: {
          id
        }
      }) 
    }


  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
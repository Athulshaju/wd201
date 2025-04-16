'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list\n");

      console.log("Overdue");
      const overdueTodos = await Todo.overdue();
      const overdueList = overdueTodos.map((todo) => todo.displayableString()).join("\n");
      console.log(overdueList);
      console.log("\n");

      console.log("Due Today");
      const dueTodayTodos = await this.dueToday();
      const dueTodayList = dueTodayTodos.map((todo) => todo.displayableString()).join("\n");
      console.log(dueTodayList);
      console.log("\n");

      console.log("Due Later");
      const dueLaterTodos = await this.dueLater();
      const dueLaterList = dueLaterTodos.map((todo) => todo.displayableString()).join("\n");
      console.log(dueLaterList);
      console.log("\n");

      console.log("Completed past Due-Time");
      const completedPastDueTime = await this.completedPastDueTime();
      const completedList = completedPastDueTime.map((todo) => todo.displayableString()).join("\n");
      console.log(completedList);
      console.log("\n");
    }

    

    static async overdue() {
      const today = new Date().toISOString().split("T")[0]; // Correct date format
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: today }, // Less than today
          completed: false,
        },
        logging: console.log,
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      const today = new Date().toISOString().split("T")[0]; // Correct date format
      return await Todo.findAll({
        where: {
          dueDate: today, // Equal to today
        },
        logging: console.log,
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      const today = new Date().toISOString().split("T")[0]; // Correct date format
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: today }, // Greater than today
        },
        logging: console.log,
        order: [["dueDate", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id); // Find the todo by primary key (ID)
      if (todo) {
        todo.completed = true; // Mark as complete
        await todo.save(); // Save the changes to the database
      } else {
        throw new Error(`Todo with ID ${id} not found`);
      }
    }
    static async completedPastDueTime() {
      const today = new Date().toISOString().split("T")[0]; // Correct date format
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: today }, // Less than today
          completed: true,
        },
        logging: console.log,
        order: [["dueDate", "ASC"]],
      });
    }
    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const today = new Date().toISOString().split("T")[0];
      if (this.dueDate === today) {
        // Exclude the date for todos due today
        return `${this.id}. ${checkbox} ${this.title.trim()}`;
      }
      // Include the date for overdue or due later todos
      return `${this.id}. ${checkbox} ${this.title.trim()} ${this.dueDate}`;
      
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
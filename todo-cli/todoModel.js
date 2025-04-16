const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("./connectDB.js");

class Todo extends Model {
    static async addTask(params){
        return await Todo.create(params);
    }

    displayableString(){
        return ` ${this.completed ? '[x]' : '[ ]'} ${this.id}. ${this.title} - ${this.dueDate}`
    }
}


Todo.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        modelName: "Todo"
    }
);

module.exports = { Todo };
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    username: "postgres",
    password: "1234",
    database: "todo_db",
    logging: false
});

const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
};

module.exports = {
    connect,
    sequelize
};
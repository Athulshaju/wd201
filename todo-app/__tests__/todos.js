/* eslint-disable */

const request=require("supertest");

const db=require("../models/index");
const app=require("../app");

let server,agent;

describe("Todo Test Suite", () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        server = app.listen(3000, () => { })
        agent=request.agent(server);
    })

    afterAll(async () => {
        await db.sequelize.close();
        server.close();
    })

    test("Create new todo", async () => {
        const response = await agent.post("/todos").send({
            "title" :"Buy milk",
            "dueDate": new Date().toISOString(),
            "completed": false
        });
        expect(response.statusCode).toBe(302);
    })

    // test("test markAsCompleted", async () => {
    //     const response = await agent.post("/todos").send({
    //         "title" :"Buy milk",
    //         "dueDate": new Date().toISOString(),
    //         "completed": false
    //     });
    //     const parsedResponse = JSON.parse(response.text);
    //     const todoId = parsedResponse.id;
    //     expect(parsedResponse.completed).toBe(false);

    //     const markAsCompletedResponse = await agent.put(`/todos/${todoId}/markAsCompleted`).send();
    //     const parsedUpdateResponse = JSON.parse(markAsCompletedResponse.text);
    //     expect(parsedUpdateResponse.completed).toBe(true);
    // });

    test("testing get all todos", async () => {
        await agent.post("/todos").send({
            "title" :"Buy bread",
            "dueDate": new Date().toISOString(),
            "completed": false
        });

        await agent.post("/todos").send({
            "title" :"Buy eggs",
            "dueDate": new Date().toISOString(),
            "completed": false
        });

        response = await agent.get("/todos").send();
        const parsedResponse = JSON.parse(response.text);
        expect(parsedResponse.length).toBe(3);
        
        
    })

    // test("testing delete",async() => {
    //     const response = await agent.post("/todos").send({
    //         "title" :"Buy milk",
    //         "dueDate": new Date().toISOString(),
    //         "completed": false
    //     });
    //     const parsedResponse = JSON.parse(response.text);
    //     const todoId = parsedResponse.id;

    //     const deleteResponse = await agent.delete(`/todos/${todoId}`).send();
    //     expect(deleteResponse.statusCode).toBe(200);
    // })
})
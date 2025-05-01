/* eslint-disable */

const request=require("supertest");
var cheerio = require("cheerio");
const db=require("../models/index");
const app=require("../app");

let server,agent;

function extractCsrfToken(res) {
    var $ = cheerio.load(res.text);
    return $("[name=_csrf]").val();
}

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
        const res=await agent.get("/");
        const csrfToken = extractCsrfToken(res);
        const response = await agent.post("/todos").send({
            "title" :"Buy milk",
            "dueDate": new Date().toISOString(),
            "completed": false,
            "_csrf": csrfToken
        });
        expect(response.statusCode).toBe(302);
    })

    test("test markAsCompleted", async () => {
        let res=await agent.get("/");
        let csrfToken = extractCsrfToken(res);
        await agent.post("/todos").send({
            "title" :"Buy milk",
            "dueDate": new Date().toISOString(),
            "completed": false,
            "_csrf": csrfToken
        });
        
        const groupedTodosResponse = await agent.get("/").set("Accept", "application/json");
        const parsedGroupResponse = JSON.parse(groupedTodosResponse.text);
        const dueTodayCount=parsedGroupResponse.dueToday.length;
        const latestTodo=parsedGroupResponse.dueToday[dueTodayCount-1];
        res=await agent.get("/");
        csrfToken = extractCsrfToken(res);
        const markAsCompletedResponse = await agent.put(`/todos/${latestTodo.id}`).send({
            "_csrf": csrfToken
        });
        const parsedUpdateResponse = JSON.parse(markAsCompletedResponse.text);
        expect(parsedUpdateResponse.completed).toBe(false);

    });

    test("testing get all todos", async () => {
        let res=await agent.get("/");
        let csrfToken = extractCsrfToken(res);
        await agent.post("/todos").send({
            "title" :"Buy bread",
            "dueDate": new Date().toISOString(),
            "completed": false,
            "_csrf": csrfToken
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
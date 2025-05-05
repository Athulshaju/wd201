/* eslint-disable */

const request=require("supertest");
var cheerio = require("cheerio");
const db=require("../models/index");
const app=require("../app");

let server,agent;

function extractCsrfToken(response) {
    var $ = cheerio.load(response.text);
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

    test("signup", async()=> {
        let response=await agent.get("/signup");
        const csrfToken = extractCsrfToken(response);
        response = await agent.post("/users").send({
            firstName: "Test",
            lastName: "User A",
            email: "testusera@test.com",
            password:"1234",
            _csrf: csrfToken
        })
        expect(response.statusCode).toBe(302);
    })

    

    test("Create new todo", async () => {
        
        const res=await agent.get("/todos");
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
        
        let res=await agent.get("/todos");
        let csrfToken = extractCsrfToken(res);
        await agent.post("/todos").send({
            "title" :"Buy milk",
            "dueDate": new Date().toISOString(),
            "completed": false,
            "_csrf": csrfToken
        });
        
        const groupedTodosResponse = await agent.get("/todos").set("Accept", "application/json");
        const parsedGroupResponse = JSON.parse(groupedTodosResponse.text);
        const dueTodayCount=parsedGroupResponse.dueToday.length;
        const latestTodo=parsedGroupResponse.dueToday[dueTodayCount-1];
        res=await agent.get("/todos");
        csrfToken = extractCsrfToken(res);
        const markAsCompletedResponse = await agent.put(`/todos/${latestTodo.id}`).send({
            "_csrf": csrfToken
        });
        const parsedUpdateResponse = JSON.parse(markAsCompletedResponse.text);
        expect(parsedUpdateResponse.completed).toBe(false);

    });

    test("testing get all todos", async () => {
        
        let response = await agent.get("/todos");
        let csrfToken = extractCsrfToken(response);
        await agent.post("/todos").send({
            "title" :"Buy bread",
            "dueDate": new Date().toISOString(),
            "completed": false,
            "_csrf": csrfToken
        });

    

        response = await agent.get("/todos").send().set("Accept", "application/json");
        const parsedResponse = JSON.parse(response.text);
        const totalTodos=parsedResponse.dueToday.length+parsedResponse.dueLater.length+parsedResponse.overdue.length+parsedResponse.completedTodo.length;
        expect(totalTodos).toBe(3); 
    })

    test("testing delete",async() => {
        
        let response = await agent.get("/todos")
        let csrfToken = extractCsrfToken(response);
        await agent.post("/todos").send({
            "title" :"Buy iphone",
            "dueDate": new Date().toISOString(),
            "completed": false,
            "_csrf": csrfToken
        });
        const groupedTodosResponse = await agent.get("/todos").set("Accept", "application/json");
        const parsedResponse = JSON.parse(groupedTodosResponse.text);
        expect(parsedResponse.dueToday).toBeDefined();
        const dueTodayCount=parsedResponse.dueToday.length;
        const latestTodo=parsedResponse.dueToday[dueTodayCount-1];

        response = await agent.get("/todos");
        csrfToken = extractCsrfToken(response);
        const deleteResponse = await agent.delete(`/todos/${latestTodo.id}`).send({
            "_csrf": csrfToken
        });
        expect(deleteResponse.statusCode).toBe(200);
    })
})
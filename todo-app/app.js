const express=require("express");
const app=express();
const {Todo} = require("./models")
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const path=require("path");
var csrf = require("tiny-csrf");
var cookieParser = require('cookie-parser');


app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser("secret"));
// eslint-disable-next-line no-undef
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

// eslint-disable-next-line no-unused-vars
const { Op } = Sequelize;


app.set("view engine","ejs");
app.get("/",async (request,response)=>{
    const overdue= await Todo.overdueTodos();
    const dueToday= await Todo.dueTodayTodos();
    const dueLater= await Todo.dueLaterTodos();
    const completedTodo = await Todo.completedTodos();

    if(request.accepts("html")){
        console.log("Generated CSRF Token:", request.csrfToken());
        response.render("index",{title:"Todo Application",overdue,dueToday,dueLater,completedTodo,csrfToken: request.csrfToken()});
    }
    else {
        response.json({overdue,dueToday,dueLater,completedTodo});
    }
    

})



app.get("/todos",async(request,response)=>{
    //response.send("Hello World");
    console.log("Todo list");
    const todoItems=await Todo.getAllTodos();
    return response.json(todoItems);
    

})

app.get("/todos/:id", async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  });


app.post("/todos",async (request,response)=>{
    console.log("Received CSRF Token:", request.body._csrf);
    console.log("Expected CSRF Token:", request.csrfToken());
    try{
        await Todo.addTodo({title: request.body.title,dueDate: request.body.dueDate,completed: false})
        return response.redirect("/");
    }
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
    

})

app.put("/todos/:id", async (request,response)=>{
    console.log("todo updated",request.params.id);
    const todo=await Todo.findByPk(request.params.id)
    try{
        
        const updatedTodo = await todo.setCompletionStatus(request.body.completed);
        return response.json(updatedTodo);
    }
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
})

app.delete("/todos/:id", async (request,response)=>{
    console.log("todo deleted",request.params.id);
    try{
        await Todo.remove(request.params.id)
        return response.json({success:true})

    } 
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
})

module.exports=app; 
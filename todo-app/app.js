const express=require("express");
const app=express();
const {Todo} = require("./models")
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const path=require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

const { Op } = Sequelize;


app.set("view engine","ejs");
app.get("/",async (request,response)=>{
    const today = new Date().toISOString().split("T")[0];

    const overdueTodos= await Todo.findAll({
        // eslint-disable-next-line no-undef
        where:{ dueDate: {[Op.lt]: today},completed:false},
    })

    const dueTodayTodos= await Todo.findAll({
        where:{ dueDate: today,completed:false},
    })
    const dueLaterTodos= await Todo.findAll({
        // eslint-disable-next-line no-undef
        where:{ dueDate: {[Op.gt]: today},completed:false},
    })

    if(request.accepts("html")){
        response.render("index",{overdueTodos,dueTodayTodos,dueLaterTodos});
    }
    else {
        response.json(overdueTodos,dueTodayTodos,dueLaterTodos);
    }
    

})

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

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
    console.log("Creating Todo",request.body);
    try{
        const todo=await Todo.addTodo({title: request.body.title,dueDate: request.body.dueDate,completed: false})
        return response.redirect("/");
    }
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
    

})

app.put("/todos/:id/markAsCompleted", async (request,response)=>{
    console.log("todo updated",request.params.id);
    const todo=await Todo.findByPk(request.params.id)
    try{
        
        const updatedTodo = await todo.markAsCompleted()
        return response.json(updatedTodo);
    }
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
})

app.delete("/todos/:id", async (request,response)=>{
    console.log("todo deleted",request.params.id);
    const todo = await Todo.findByPk(request.params.id)
    try{
        await todo.destroy();
        return response.json({success:true})

    } 
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
})

module.exports=app; 
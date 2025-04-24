const express=require("express");
const todo = require("../todo-cli/models/todo");
const app=express();
const {Todo} = require("./models")
const bodyParser = require("body-parser");
app.use(bodyParser.json());

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
        return response.json(todo);
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
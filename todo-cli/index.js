const { connect } = require("./connectDB.js");
const { Todo } = require("./todoModel.js");

const createTodo = async () => {
    try {
        await connect();
        await Todo.sync(); // Create table if it doesn't exist
        
        const todo = await Todo.addTask({
            title: "Second Item",
            dueDate: new Date(),
            completed: false
        });
        console.log(`Created todo with ID: ${todo.id}`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        // eslint-disable-next-line no-undef
        process.exit();
    }
};

const countItems =async () => {
    try {
        const totalCount = await Todo.count();
        console.log(`Found ${totalCount} items in the table`);
    } catch(error){
        console.error(error);
    }
}

const getAllItems = async() => {
    try {
        const todos = await Todo.findAll();
        const todoList=todos.map(todo => todo.displayableString()).join("\n");
        console.log(todoList);
    }
    catch(error){
        console.error(error);
    }
}

const getSingleTodo = async() => {
    try {
        const todo = await Todo.findOne();
        console.log(todo.displayableString());
    }
    catch(error){
        console.error(error);
    }
}


const updateItem = async(id) => {
    try{
        const todo=await Todo.update({completed:true},{
            where :{
                id: id
            }
        })
        

    }
    catch(error){
        console.error(error);
    }
}

const deleteItem = async(id) => {
    try {
        const deletedItemCount= await Todo.destroy({
            where:{
                id: id
            }    
        })
        console.log(`Deleted ${deletedItemCount} item(s)`);
    }
    catch(error){
        console.error(error);
    }
}


(async () => {
    //await createTodo();
    //await countItems();
    await getAllItems();

    //await updateItem(2);
    //await deleteItem(2);
    //await getAllItems();
})();
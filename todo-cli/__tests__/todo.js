const todoList = require('../todo');

const {all, markAsComplete, add} = todoList();

describe("Todo Test Suite",()=>{
    beforeAll(() => {
        add(
            {
                title:"Test Todo",
                completed: false, 
                dueDate: new Date().toISOString().slice(0, 10)
            }
        );
    })
    test("Should add new Todo",()=>{
        const todoItemLength = all.length
        add(
            {
                title:"Test Todo",
                completed: false, 
                dueDate: new Date().toISOString().slice(0, 10)
            }
        );
        expect(all.length).toBe(todoItemLength + 1);
    });

    test("Should mark Todo as complete",()=>{
        expect(all[0].completed).toBe(false);
        markAsComplete(0);
        expect(all[0].completed).toBe(true);
    });

})
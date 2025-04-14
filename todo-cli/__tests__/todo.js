const todoList = require('../todo');

describe("Todo Test Suite", () => {
    let todos;

    beforeEach(() => {
        todos = todoList();
        const today = new Date().toLocaleDateString('en-CA');
        
        // Add test todos
        todos.add({
            title: "Test Overdue",
            completed: false,
            dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-CA')
        });

        todos.add({
            title: "Test Due Today",
            completed: false,
            dueDate: today
        });

        todos.add({
            title: "Test Due Later",
            completed: false,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-CA')
        });
    });

    test("Should add new Todo", () => {
        const todoItemLength = todos.all.length;
        todos.add({
            title: "Test Todo",
            completed: false,
            dueDate: new Date().toLocaleDateString('en-CA')
        });
        expect(todos.all.length).toBe(todoItemLength + 1);
    });

    test("Should mark Todo as complete", () => {
        expect(todos.all[0].completed).toBe(false);
        todos.markAsComplete(0);
        expect(todos.all[0].completed).toBe(true);
    });

    test("Should return overdue todos", () => {
        const overdueTodos = todos.overdue();
        expect(overdueTodos.length).toBe(1);
        expect(overdueTodos[0].title).toBe("Test Overdue");
    });

    test("Should return todos due today", () => {
        const dueTodayTodos = todos.dueToday();
        expect(dueTodayTodos.length).toBe(1);
        expect(dueTodayTodos[0].title).toBe("Test Due Today");
    });

    test("Should return todos due later", () => {
        const dueLaterTodos = todos.dueLater();
        expect(dueLaterTodos.length).toBe(1);
        expect(dueLaterTodos[0].title).toBe("Test Due Later");
    });
});
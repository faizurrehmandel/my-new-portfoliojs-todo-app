// Todo App JavaScript

class TodoApp {
    constructor() {
        this.todos = [];
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.list = document.getElementById('todo-list');
        this.taskCount = document.getElementById('task-count');

        this.initialize();
    }

    initialize() {
        // Load saved todos
        this.loadTodos();

        // Event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Update task count
        this.updateTaskCount();
    }

    loadTodos() {
        try {
            const savedTodos = localStorage.getItem('todos');
            if (savedTodos) {
                this.todos = JSON.parse(savedTodos);
                this.renderTodos();
            }
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showError('Failed to load saved todos');
        }
    }

    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
            this.showError('Failed to save todos');
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const text = this.input.value.trim();
        if (!text) return;

        try {
            this.addTodo(text);
            this.input.value = '';
        } catch (error) {
            console.error('Error adding todo:', error);
            this.showError('Failed to add todo');
        }
    }

    addTodo(text) {
        const todo = {
            id: Date.now(),
            text,
            completed: false
        };

        this.todos.unshift(todo);
        this.renderTodo(todo);
        this.saveTodos();
        this.updateTaskCount();
    }

    renderTodos() {
        this.list.innerHTML = '';
        this.todos.forEach(todo => this.renderTodo(todo));
    }

    renderTodo(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <input type="checkbox" 
                   class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''}
                   aria-label="Mark todo as complete">
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <button class="delete-btn" aria-label="Delete todo">
                <i class="fas fa-trash"></i>
            </button>
        `;

        // Event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        this.list.insertBefore(li, this.list.firstChild);
    }

    toggleTodo(id) {
        try {
            const todo = this.todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                const li = this.list.querySelector(`[data-id="${id}"]`);
                if (li) {
                    li.classList.toggle('completed');
                }
                this.saveTodos();
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
            this.showError('Failed to update todo');
        }
    }

    deleteTodo(id) {
        try {
            const li = this.list.querySelector(`[data-id="${id}"]`);
            if (li) {
                li.classList.add('fade-out');
                setTimeout(() => {
                    this.todos = this.todos.filter(t => t.id !== id);
                    li.remove();
                    this.saveTodos();
                    this.updateTaskCount();
                }, 300);
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showError('Failed to delete todo');
        }
    }

    updateTaskCount() {
        this.taskCount.textContent = this.todos.length;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

// Fetch todos from the server and display them
async function fetchTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  todoList.innerHTML = "";
  for (const todo of todos) {
    addTodoToList(todo);
  }
}

// Add a todo to the list
function addTodoToList(todo) {
  const li = document.createElement("li");
  li.classList.add("flex", "justify-between", "items-center", "p-4", "border", "border-gray-300", "rounded");
  li.innerHTML = `
    <span class="${todo.completed ? "completed" : ""}">${todo.title}</span>
    <div>
      <button class="toggle bg-green-500 text-white px-2 py-1 rounded mr-2">Toggle</button>
      <button class="delete bg-red-500 text-white px-2 py-1 rounded">Delete</button>
    </div>
  `;
  li.querySelector(".toggle").addEventListener("click", () => toggleCompleted(todo.id, !todo.completed));
  li.querySelector(".delete").addEventListener("click", () => deleteTodo(todo.id));
  todoList.appendChild(li);
}

// Add a new todo
async function addTodo() {
  const title = todoInput.value;
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  });
  const todo = await res.json();
  addTodoToList(todo);
  todoInput.value = "";
}

// Toggle the completed status of a todo
async function toggleCompleted(id, completed) {
  await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ completed })
  });
  fetchTodos();
}

// Delete a todo
async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, {
    method: "DELETE"
  });
  fetchTodos();
}

// Fetch todos when the page loads
fetchTodos();

// Add a new todo when the form is submitted
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});

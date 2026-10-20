const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const counter = document.getElementById("counter");

let todos = loadTodos();

function loadTodos() {
  try {
    const saved = localStorage.getItem("todos");
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    // اگر ذخیره ممکن نبود، برنامه همچنان کار می‌کند
  }
}

function addTodo(text) {
  todos.push({ id: Date.now(), text: text, done: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function render() {
  list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    if (todo.done) {
      li.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.textContent = todo.text;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "delete";
    removeButton.textContent = "Delete";
    removeButton.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, removeButton);
    list.appendChild(li);
  });

  const remaining = todos.filter((todo) => !todo.done).length;
  counter.textContent = remaining + " task(s) left";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text === "") {
    return;
  }
  addTodo(text);
  input.value = "";
  input.focus();
});

render();
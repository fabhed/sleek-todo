const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");
const app = express();
const port = 8080;

// Create a new database or connect to an existing one
const db = new Database("./database.sqlite");

// Create a table for todos if it doesn't exist
const tableCreationStmt = db.prepare(`
  CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0
  )
`);

tableCreationStmt.run();

// Parse JSON bodies
app.use(express.json());

// Serve the public directory
app.use(express.static(path.join(__dirname, "public")));

// Get all todos
app.get("/api/todos", (req, res) => {
  const todos = db.prepare("SELECT * FROM todos").all();
  res.json(todos);
});

// Create a new todo
app.post("/api/todos", (req, res) => {
  const { title } = req.body;
  const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
  const info = stmt.run(title);
  res.json(info);
});

// Update a todo
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const stmt = db.prepare("UPDATE todos SET title = ?, completed = ? WHERE id = ?");
  const info = stmt.run(title, completed, id);
  res.json(info);
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
  const info = stmt.run(id);
  res.json(info);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

require("dotenv").config();
const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// POST New – Create. Task field required to validate.
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;

  // Validate required field
  if (!task) {
    return res.status(400).json({
      error: 'Missing data - Task field required'
    });
  }

  const newTodo = {
    id: todos.length + 1,
    task,
    completed: completed ?? false
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

//returns list of active todos
app.get('/todos/active', (req, res) => {
  const notcompleted = todos.filter((t) => !t.completed);
  res.json(notcompleted); // Custom Read!
});

//returns list of completed todos
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

//returns a single todo of the ID specified in the route
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) return res.status(404).json({ error: 'Not found' });

  res.json(todo);
});



app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

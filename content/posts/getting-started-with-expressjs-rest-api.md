---
title: "Getting Started with Express.js: Setting Up Your First REST API"
publishDate: 2025-10-9
description: "A beginner-friendly guide to setting up your first REST API using Express.js and Node.js. Learn how to initialize a project, create routes, handle requests, connect to a database with MongoDB, implement middleware for validation and error handling, and test your API endpoints. This practical tutorial walks through building a simple yet functional task management API, perfect for developers starting their backend journey with Express.js and understanding the fundamentals of RESTful architecture."
category: "Backend Development"
tags: ["Express.js", "Node.js", "REST API", "JavaScript", "Backend", "Tutorial", "Getting Started"]
thumbnail: "/images/posts/getting-started-with-expressjs-rest-api.png"
author: "Putra Prassiesa Abimanyu"
---

# Getting Started with Express.js: Setting Up Your First REST API

When I first started learning backend development, Express.js felt overwhelming. There were so many concepts—routing, middleware, HTTP methods—that I didn't know where to begin. But after building my first REST API, everything clicked. Express.js is actually quite straightforward once you understand the basics.

In this guide, I'll walk you through setting up a simple REST API from scratch. We'll build a task management API that lets you create, read, update, and delete tasks. By the end, you'll have a working API and understand the core concepts of Express.js.

## What You'll Need

Before we start, make sure you have:

- **Node.js** installed (version 16 or higher)
- A code editor (I use VS Code)
- Basic JavaScript knowledge
- A terminal or command prompt

You can check if Node.js is installed by running:

```bash
node --version
```

If it shows a version number, you're good to go!

## Setting Up the Project

Let's create a new folder for our project and initialize it:

```bash
mkdir task-api
cd task-api
npm init -y
```

The `-y` flag automatically answers "yes" to all the setup questions, creating a basic `package.json` file.

Now install Express.js:

```bash
npm install express
```

Great! We've got Express.js installed. Let's also install a few helpful packages:

```bash
npm install dotenv cors
npm install --save-dev nodemon
```

Here's what each package does:

- **express**: Our web framework
- **dotenv**: Loads environment variables from a `.env` file
- **cors**: Allows our API to be accessed from different domains
- **nodemon**: Automatically restarts the server when we make changes (development only)

## Creating Your First Server

Create a file called `server.js` in your project root:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task API!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Let's break this down:

1. We import Express and create an app instance
2. We set up middleware with `app.use()` - these run before our routes
3. We create a simple GET route that returns a welcome message
4. We start the server on port 3000

Update your `package.json` to add a start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Now run your server:

```bash
npm run dev
```

Open your browser and visit `http://localhost:3000`. You should see:

```json
{"message": "Welcome to Task API!"}
```

Congratulations! Your server is running.

## Understanding REST and HTTP Methods

REST APIs use HTTP methods to perform different operations:

- **GET**: Retrieve data
- **POST**: Create new data
- **PUT/PATCH**: Update existing data
- **DELETE**: Remove data

For our task API, we'll implement all of these. Let's start with a simple in-memory data store (we'll add a database later).

## Building the Task API

Create a folder called `routes` and add `tasks.js`:

```javascript
const express = require('express');
const router = express.Router();

// In-memory storage (temporary)
let tasks = [
  { id: 1, title: 'Learn Express.js', completed: false },
  { id: 2, title: 'Build a REST API', completed: false }
];

// GET all tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// GET single task
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  res.json(task);
});

// POST create new task
router.post('/', (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update task
router.put('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  const { title, completed } = req.body;
  
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;
  
  res.json(task);
});

// DELETE task
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
```

Now update `server.js` to use these routes:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task API!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing Your API

You can test your API using a tool like Postman or Thunder Client (VS Code extension), or even with curl:

**Get all tasks:**

```bash
curl http://localhost:3000/api/tasks
```

**Create a new task:**

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn REST APIs"}'
```

**Update a task:**

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a task:**

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Adding MongoDB for Data Persistence

Storing data in memory works for learning, but it disappears when the server restarts. Let's add MongoDB for real data persistence.

Install MongoDB driver:

```bash
npm install mongodb
```

Create a `.env` file:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskdb
```

Create `db.js` to handle the database connection:

```javascript
const { MongoClient } = require('mongodb');

let db;

async function connectDB() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
```

Update `server.js` to connect to MongoDB:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task API!' });
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

Update `routes/tasks.js` to use MongoDB:

```javascript
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const tasks = await db.collection('tasks').find().toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const db = getDB();
    const result = await db.collection('tasks').insertOne({
      title,
      completed: false,
      createdAt: new Date()
    });
    
    const newTask = await db.collection('tasks').findOne({ _id: result.insertedId });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    const db = getDB();
    
    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, completed } },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('tasks').deleteOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

## Adding Error Handling Middleware

Good APIs handle errors gracefully. Add this to the bottom of `server.js`:

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
```

## What's Next?

Congratulations! You've built a working REST API with Express.js. Here's what you've learned:

- Setting up an Express.js project
- Creating routes for different HTTP methods
- Handling requests and responses
- Connecting to MongoDB
- Basic error handling

To take this further, you could add:

- User authentication with JWT
- Input validation with libraries like Joi
- Request logging
- Rate limiting
- API documentation with Swagger

## Final Thoughts

Building my first REST API was a huge milestone in my learning journey. Express.js makes it relatively simple once you understand the core concepts: routes, middleware, and request handling.

The best way to learn is by building. Start with simple projects like this task API, then gradually add more features. Don't worry about making it perfect—just get it working first, then improve it.

Keep coding, and you'll be building complex APIs in no time!

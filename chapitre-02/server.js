const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// base de données fictive sous forme d'array
let tasks = [
    {
        id: 1,
        title: "Apprendre Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Apprendre Express.js",
        completed: false
    }
];

// routes

// obtenir toutes les tâches
app.get('/tasks', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(tasks).end();
})

// ajouter une tâche
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false
    };
    tasks.push(newTask);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(newTask);
});

// modifier une tâche
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));

    if (!task) return res.status(404).send('Task not found');

    task.title = req.body.title || task.title;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(task);
});

// supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));

    if (!taskIndex) return res.status(404).send('Task not found');

    const deletedTask = tasks.splice(taskIndex, 1);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(deletedTask);
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

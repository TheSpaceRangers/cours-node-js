require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`worker pid=${process.pid}`);

// Middleware
app.use(express.json());

// Connexion à la base de données
const DB_URI = process.env.DB_URI || 'mongodb://admin:password123@192.168.1.101:1000/crud_db?authSource=admin';
mongoose
    .connect(DB_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch((err) => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/tasks', taskRoutes);

// Heavy
app.get("/heavy", (req, res) => {
    let total = 0;
    for (let i = 0; i < 5_000_000; i++) {
        total++;
    }
    res.send(`The result of the CPU intensive task is ${total}\n`);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;
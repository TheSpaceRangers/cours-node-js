require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const Redis = require('ioredis');

const app = express();

// Configuration de la base de données MySQL
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

// Vérification de la connexion MySQL
db.getConnection((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL:', err);
        process.exit(1);
    } else {
        console.log('Connexion à MySQL réussie.');
    }
});

// Configuration de Redis
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

// Ajouter MySQL et Redis au contexte de l'application
app.set('db', db);
app.set('redis', redis);

// Middleware pour le JSON
app.use(express.json());

// Import des routes
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur API en cours d'exécution sur http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');

const connectDB = require('./db');
require('dotenv').config();

const startServer = async () => {
    const app = express();

    // Middleware
    app.use(bodyParser.json());

    // Connexion à MongoDB
    await connectDB();

    // Routes
    const taskRoutes = require('./routes/tasks');
    app.use('/tasks', taskRoutes);

    // Lancement du serveur
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Serveur API en cours d'exécution sur http://localhost:${PORT}`));
};

// Démarrage du serveur
startServer().catch(err => {
    console.error('Erreur critique lors du démarrage du serveur', err);
    process.exit(1);
});

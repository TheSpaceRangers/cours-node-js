const Task = require('../models/task');

exports.getTasks = async (req, res) => {
    try {
        const { completed, search, page = 1, limit = 10 } = req.query;

        const redis = req.app.get('redis');
        const cacheKey = `tasks:${completed || 'all'}:${search || 'none'}:${page}:${limit}`;
        const cachedTasks = await redis.get(cacheKey);
        if (cachedTasks)
            return res.json(JSON.parse(cachedTasks));

        const db = req.app.get('db');
        const task = new Task(db);

        const filters = [];
        if (completed !== undefined)
            filters.push({ field: 'is_completed = ?', value: completed === 'true' });
        if (search)
            filters.push({ field: 'title LIKE ?', value: `%${search}%` });

        const offset = (page - 1) * limit;

        const tasks = await task.getTasks(filters, limit, offset);

        await redis.set(cacheKey, JSON.stringify(tasks), 'EX', 60 * 5);

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des tâches.', err});
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || title.trim() === '')
            return res.status(400).json({ error: 'Le titre est requis.' });

        const db = req.app.get('db');
        const Task = require('../models/Task');
        const task = new Task(db);

        res.status(201).json(await task.createTask(title.trim()));
    } catch (err) {
        console.error('Erreur lors de la création de la tâche:', err);
        res.status(500).json({ error: 'Erreur lors de la création de la tâche.', err });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const db = req.app.get('db');
        const Task = require('../models/Task');
        const task = new Task(db);

        // Vérifier si la tâche existe
        const findTask = await task.findById(id);
        if (!findTask)
            return res.status(404).json({ error: 'Tâche non trouvée.' });

        const updates = {};
        if (title !== undefined)
            updates.title = title.trim();
        if (completed !== undefined)
            updates.is_completed = completed;

        const updatedTask = await task.updateTask(id, updates);

        const redis = req.app.get('redis');
        const cacheKey = `task:${id}`;
        if (await redis.exists(cacheKey))
            await redis.set(cacheKey, JSON.stringify(updatedTask), 'EX', 60 * 5);

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche.', err });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const db = req.app.get('db');
        const Task = require('../models/Task');
        const task = new Task(db);

        // Supprimer la tâche dans la base de données
        const findTask = await task.deleteTask(id);
        if (!findTask)
            return res.status(404).json({ error: 'Tâche non trouvée.' });

        const redis = req.app.get('redis');
        const cacheKey = `task:${id}`;
        if (await redis.exists(cacheKey))
            await redis.del(cacheKey);

        res.json({ message: 'Tâche supprimée avec succès.', findTask });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la tâche.', err });
    }
};

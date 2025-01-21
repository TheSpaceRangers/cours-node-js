const Task = require('../models/task');

// Obtenir toutes les tâches
exports.getTasks = async (req, res) => {
    try {
        const { completed, search, page = 1, limit = 10 } = req.query;

        let filter = {};
        if (completed !== undefined)
            filter.completed = completed === 'true';
        if (search)
            filter.title = { $regex: search, $options: 'i' };

        const tasks = await Task.find(filter, null, {
            skip: (parseInt(page) - 1) * parseInt(limit),
            limit: parseInt(limit)
        });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des tâches.', err});
    }
};

// Ajouter une tâche
exports.createTask = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || title.trim() === '')
            return res.status(400).json({ error: 'Le titre est requis.' });

        const newTask = new Task({ title: title.trim() });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création de la tâche.' });
    }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const task = await Task.findById(String(id));
        if (!task)
            return res.status(404).json({ error: 'Tâche non trouvée.' });

        if (title !== undefined)
            task.title = title.trim();
        if (completed !== undefined)
            task.completed = completed;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche.' });
    }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByIdAndDelete(String(id));
        if (!task)
            return res.status(404).json({ error: 'Tâche non trouvée.' });

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la tâche.' });
    }
};

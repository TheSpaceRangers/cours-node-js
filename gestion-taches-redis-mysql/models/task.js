class Task {
    constructor(db) {
        this.db = db; // Instance de connexion MySQL
    }

    // Récupérer toutes les tâches
    getAllTasks() {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Récupérer une tâche par son ID
    getTaskById(id) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]); // Retourne la première tâche (car ID unique)
            });
        });
    }

    // Ajouter une nouvelle tâche
    createTask(title) {
        return new Promise((resolve, reject) => {
            this.db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ id: result.insertId, title, is_completed: false });
            });
        });
    }

    // Mettre à jour une tâche (par exemple, la marquer comme terminée)
    updateTask(id, updates) {
        const fields = [];
        const values = [];

        // Construire dynamiquement la requête de mise à jour
        Object.keys(updates).forEach((key) => {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        });
        values.push(id); // ID pour la clause WHERE

        return new Promise((resolve, reject) => {
            const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
            this.db.query(sql, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    // Supprimer une tâche par ID
    deleteTask(id) {
        return new Promise((resolve, reject) => {
            this.db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = Task;

class Task {
    constructor(db) {
        this.db = db; // Instance de connexion MySQL
    }

    getTasks(
        filters = [],
        limit = 10,
        offset = 0
    ) {
        return new Promise((resolve, reject) => {
            const whereClause = filters.length ? `WHERE ${filters.map(filter => filter.field).join(' AND ')}` : '';
            const values = filters.map(filter => filter.value);
            values.push(parseInt(limit), parseInt(offset));

            const sql = `SELECT * 
                FROM tasks 
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;

            this.db.query(sql, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    createTask(
        title
    ) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tasks (title) VALUES (?)`;

            this.db.query(sql, [title], (err, result) => {
                if (err)
                    return reject(err);

                resolve({
                    id: result.insertId,
                    title,
                    is_completed: false,
                    created_at: new Date(),
                });
            });
        });
    }

    updateTask(
        id,
        updates
    ) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];

            Object.keys(updates).forEach((key) => {
                fields.push(`${key} = ?`);
                values.push(updates[key]);
            });

            values.push(id);

            const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;

            this.db.query(sql, values, (err, result) => {
                if (err)
                    return reject(err);

                if (result.affectedRows === 0)
                    return reject(new Error('Tâche non trouvée.'));

                resolve({ id, ...updates });
            });
        });
    }

    deleteTask(
        id
    ) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM tasks WHERE id = ?`;

            this.db.query(sql, [id], (err, result) => {
                if (err)
                    return reject(err);

                if (result.affectedRows === 0)
                    return resolve(null);

                resolve({ id });v
            });
        });
    }

    findById(
        id
    ) {
        return new Promise((
            resolve,
            reject
        ) => {
            const sql = `SELECT * FROM tasks WHERE id = ?`;

            this.db.query(sql, [id], (err, results) => {
                if (err)
                    return reject(err);

                resolve(results[0]);
            });
        });
    }
}

module.exports = Task;

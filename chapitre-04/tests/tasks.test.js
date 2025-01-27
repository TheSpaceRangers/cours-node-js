const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Task = require('../models/Task');

beforeAll(async () => {
    await mongoose.connect('mongodb://admin:password123@192.168.1.101:1000/crud_db?authSource=admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await Task.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('CRUD Tests', () => {
    test('Créer une tâche', async () => {
        const res = await request(app).post('/tasks').send({ title: 'Test Task' });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Test Task');
    });

    test('Récupérer toutes les tâches', async () => {
        await Task.create({ title: 'Test Task' });
        const res = await request(app).get('/tasks');
        expect(res.body.length).toBe(1);
    });
});
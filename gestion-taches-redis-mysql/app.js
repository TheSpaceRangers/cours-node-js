require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const Redis = require('ioredis');

const app = express();

// MySQL connection
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

// Redis connection
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

app.set('db', db);
app.set('redis', redis);

module.exports = app;

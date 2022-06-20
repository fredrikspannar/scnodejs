const dotenv = require('dotenv');
const mysql = require('mysql2');
const migration = require('mysql-migrations');

// get .env-file
dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

// setup mysql and migrations
const db = mysql.createPool({
    host: DB_HOST, 
    user: DB_USER,
    password: DB_PASSWORD,  
    database: DB_NAME,
    port: parseInt(DB_PORT), // needs to be a number
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// run migrations
migration.init(db,__dirname + '/migrations');
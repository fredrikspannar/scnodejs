"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("mysql"));
const util_1 = __importDefault(require("util"));
// get .env-file
dotenv_1.default.config();
// setup express
const app = (0, express_1.default)();
// setup express to use bodyparser and cors
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ "extended": false }));
// setup db
function dbConnect() {
    // parameters
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
    // create connection
    const connection = mysql_1.default.createConnection(config);
    // any error?
    connection.connect((err) => {
        if (err) {
            // log error and throw exception since we should not continue if db is not working
            console.log(`MySQL error: ${err.message}`);
            throw (`MySQL error: ${err.message}`);
        }
    });
    // return promise-based query and close-function to use with async/await
    return {
        query(sql, args) {
            return util_1.default.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            return util_1.default.promisify(connection.end).call(connection);
        }
    };
}
// routes
const userRouter = require('./routes/users');
userRouter(app, dbConnect);
const linksRouter = require('./routes/links');
linksRouter(app, dbConnect);
// return status 404 for routes which does not exist
app.get('*', (req, res) => {
    const error = { "error": "404 Not Found" };
    res.status(404).send(error);
});
// export app for tests with all changes that has been applied
module.exports = app;

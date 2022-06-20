"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// get .env-file
dotenv_1.default.config();
// setup exoress
const app = (0, express_1.default)();
const port = process.env.PORT;
// routes
const userRouter = require('./routes/users');
userRouter(app);
const linksRouter = require('./routes/links');
linksRouter(app);
// return status 404 for routes which does not exist
app.get('*', (req, res) => {
    const error = { "error": "404 Not Found" };
    res.status(404).send(error);
});
// start sever
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// for tests
module.exports = app;

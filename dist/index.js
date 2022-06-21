"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app = require('./app'); // for tests to be run without "adress already in use" we need to seperate the app and app.listen
// get .env-file
dotenv_1.default.config();
const port = process.env.PORT;
// start sever
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

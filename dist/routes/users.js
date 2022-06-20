"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRouter = (app) => {
    app.get('/api/users', (req, res) => {
        res.send('Express + TypeScript Server @ GET /api/users');
    });
    app.post('/api/users', (req, res) => {
        res.send('Express + TypeScript Server @ POST /api/users');
    });
};
module.exports = userRouter;

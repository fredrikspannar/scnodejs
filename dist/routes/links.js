"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linksRouter = (app) => {
    app.get('/api/links', (req, res) => {
        res.send('Express + TypeScript Server @ GET /api/links');
    });
    app.post('/api/links', (req, res) => {
        res.send('Express + TypeScript Server @ POST /api/links');
    });
};
module.exports = linksRouter;

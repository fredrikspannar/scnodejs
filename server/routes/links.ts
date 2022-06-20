import { Express, Request, Response } from 'express';

const linksRouter = (app) => {

    app.get('/api/links', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server @ GET /api/links');
    });

    app.post('/api/links', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server @ POST /api/links');
    });

}

module.exports = linksRouter;
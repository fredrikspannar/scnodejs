import { Express, Request, Response } from 'express';

const userRouter = (app) => {

    app.get('/api/users', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server @ GET /api/users');
    });

    app.post('/api/users', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server @ POST /api/users');
    });

}

module.exports = userRouter;
import { Express, Request, Response } from 'express';
import { verifyToken } from "./../includes/verifyToken";

const linksRouter = (app) => {

    app.get('/api/links', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server @ GET /api/links');
    });

    // create new link ( authorization required with token in header )
    app.post('/api/links', verifyToken, (req: Request, res: Response) => {
        // user is authenticated

        res.send('Express + TypeScript Server @ POST /api/links');

    });

}

module.exports = linksRouter;
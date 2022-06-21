import { Express, Request, Response } from 'express';
import { verifyToken } from "./../includes/verifyToken";

const linksRouter = (app, dbConnect) => {

    app.get('/link', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server @ GET /link');


/*
Return redirect:

   res.writeHead(301, { "Location": "/path/within/site" });
  return res.end();
*/

    });

    // create new link ( authorization required with token in header )
    app.post('/api/links', verifyToken, (req: Request, res: Response) => {
        // user is authenticated

        res.send('Express + TypeScript Server @ POST /api/links');

    });

}

module.exports = linksRouter;
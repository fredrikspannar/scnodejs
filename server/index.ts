import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {errorMessage} from './includes/types';

// get .env-file
dotenv.config();

// setup exoress
const app: Express = express();
const port = process.env.PORT;


// routes
const userRouter = require('./routes/users');
userRouter(app);

const linksRouter = require('./routes/links');
linksRouter(app);

// return status 404 for routes which does not exist
app.get('*', (req: Request, res: Response) => {
    const error: errorMessage = { "error":"404 Not Found" };
    res.status(404).send(error);
});

// start sever
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// for tests
module.exports = app;
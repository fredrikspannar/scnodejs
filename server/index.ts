import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

// get .env-file
dotenv.config();

// setup exoress
const app: Express = express();
const port = process.env.PORT;


// routes
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// start sever
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// for tests
module.exports = app;
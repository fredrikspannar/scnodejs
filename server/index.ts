import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import {errorMessage} from './includes/types';
import mysql from 'mysql';
import util from 'util';

// get .env-file
dotenv.config();

// setup express
const app: Express = express();

// setup express to use bodyparser and cors
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({"extended":false}))

const port = process.env.PORT;

// setup db
function dbConnect() {
  // parameters
  const config = {
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT), // needs to be a number
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  // create connection
  const connection = mysql.createConnection( config ); 
  
  // any error?
  connection.connect((err) => {
    if (err) {
      // log error and throw exception since we should not continue if db is not working
      console.log(`MySQL error: ${err.message}`)
      throw(`MySQL error: ${err.message}`);
    }
  })

  // return promise-based query and close-function to use with async/await
  return {
    query( sql:string, args:any[] ) {
      return util.promisify( connection.query ).call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}

// routes
const userRouter = require('./routes/users');
userRouter(app, dbConnect);

const linksRouter = require('./routes/links');
linksRouter(app, dbConnect);

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
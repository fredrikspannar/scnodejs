import { Express, Request, Response } from 'express';
import {errorMessage, userCreatedResponse, userLoginResponse} from './../includes/types';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const userRouter = (app, dbConnect) => {
    // helper to create an MD5-hash
    const md5 = data => crypto.createHash('md5').update(data).digest("hex");

    // get .env-file
    dotenv.config();

    // create new user
    app.post('/api/users/create', async (req: Request, res: Response) => {
        let db;

        try {
            // create mysql-connection
            db = await dbConnect();

            // validate required
            const email: string | boolean = req.body.email && req.body.email.toString().length < 255 ? req.body.email : false;
            const password: string | boolean = req.body.password && req.body.password.toString().length >= 8 && req.body.password.toString().length <= 15 ? req.body.password : false;

            if ( email && password ) {
                // valiation ok

                // does user already exist?
                const exists = await db.query("SELECT * FROM users WHERE email = ?",[email]);

                if ( exists.length > 0 ) {
                    // fail, user exists - return 409 conflict with a message
                    res.status(409).send( <errorMessage>{ error: "User already exists" } );

                } else {
                    // create a new token that expires in 2 hours
                    const token = jwt.sign( { user: email }, process.env.SECRET_TOKEN_KEY, { expiresIn: "2h" });

                    // insert into database and hash password
                    const result = await db.query("INSERT INTO users(`email`,`password`,`token`) VALUES(?,?,?)", [email, md5(password), token]);
     
                    // all done, return 201 created with created login token and user id
                    res.status(201).send( <userCreatedResponse>{ token: token, user_id: result.insertId } );                
                }

            } else {
                // validation failed

                res.status(403).send( <errorMessage>{ error: "Check required fields" } )
            }

        } catch(error) {
            console.log(`Error ${error}`)

            // some server-error
            res.status(500).send();

        } finally {
            // close mysql-connection when finished
            await db.close();
        }
        
    });


    // login existing user
    app.post('/api/users/login', async (req: Request, res: Response) => {
        let db;

        try {
            // create mysql-connection
            db = await dbConnect();   
            
            // validate required
            const email: string | boolean = req.body.email && req.body.email.toString().length < 255 ? req.body.email : false;
            const password: string | boolean = req.body.password && req.body.password.toString().length >= 8 && req.body.password.toString().length <= 15 ? req.body.password : false;

            if ( email && password ) {
                // valiation ok

                // query user
                const user = await db.query("SELECT * FROM users WHERE email = ? AND password = ?",[email, md5(password)]);

                if ( user.length > 0 ) {
                    // create a new jwt token
                    const token = jwt.sign( { user: email }, process.env.SECRET_TOKEN_KEY, { expiresIn: "2h" });

                    // update new token in db
                    const user_id = user[0].user_id;
                    const result = await db.query("UPDATE users SET token = ? WHERE user_id = ?", [token, user_id]);
     
                    // all done, return 200 with login token and user id
                    res.status(200).send( <userLoginResponse>{ token: token, user_id: result.insertId } );   

                } else {
                    // no match, return 403 with a message
                    res.status(403).send( <errorMessage>{ error: "Email and/or password is incorrect" } )
                }

            } else {
                // validation failed

                res.status(403).send( <errorMessage>{ error: "Check required fields" } )
            }

        } catch(error) {
            console.log(`Error ${error}`)

            // some server-error
            res.status(500).send();

        } finally {
            // close mysql-connection when finished
            await db.close();
        }
        
    });            
}

module.exports = userRouter;
import { Express, Request, Response } from 'express';
import { verifyToken } from "./../includes/verifyToken";
import { errorMessage } from './../includes/types';
import uniqueSlug from "unique-slug";

const linksRouter = (app, dbConnect) => {

    // redirect a short link to its final destination
    app.get('/link/:slug', async (req: Request, res: Response) => {
        let db;

        try {
            // create mysql-connection
            db = await dbConnect();

            // validate
            const slug: string | boolean = req.params.slug && req.params.slug.toString().length < 255 ? req.params.slug : false;

            if ( slug ) {
                // valiation ok

                // query database for link
                const result = await db.query("SELECT * FROM links WHERE slug = ? LIMIT 1",[slug]);
            
                if ( result.length === 0 ) {
                    // fail, link does not exist
                    res.status(403).send( <errorMessage>{ error: "Link does not exist" } );

                } else {

                    // get url to redirect to
                    const url = result[0].link;

                    // return redirect
                    res.writeHead(302, { "Location": url });
                    res.end();
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


    // create new link ( authorization required with token in header )
    app.post('/api/links/create', verifyToken, async (req: Request, res: Response) => {
        // user is authenticated

        let db;

        try {
            // create mysql-connection
            db = await dbConnect();

            // validate required
            const userId: number | boolean = req.body.userId && typeof parseInt(req.body.userId) === "number" ? parseInt(req.body.userId) : false;
            const link: string | boolean = req.body.link && req.body.link.toString().length < 255 ? req.body.link : false;

            if ( userId && link ) {
                // valiation ok

                // does link already exist?
                const exists = await db.query("SELECT * FROM links WHERE link = ? AND user_id = ?",[link,userId]);

                if ( exists.length > 0 ) {
                    // fail, user exists - return 409 conflict with a message
                    res.status(409).send( <errorMessage>{ error: "Link already exists" } );

                } else {
                    // create new link
                    
                    // create new slug which will be used for the short-url
                    const slug: string = uniqueSlug();

                    /*
                        Here we really should check if the slug really is unique and not already taken in the database
                    */

                    // insert into database
                    const result = await db.query("INSERT INTO links(`link`,`user_id`, `slug`) VALUES(?,?,?)", [link, userId, slug]);

                    // all done, return 201 created
                    res.status(201).send({});
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

module.exports = linksRouter;
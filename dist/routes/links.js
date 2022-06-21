"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyToken_1 = require("./../includes/verifyToken");
const unique_slug_1 = __importDefault(require("unique-slug"));
const linksRouter = (app, dbConnect) => {
    // redirect a short link to its final destination
    app.get('/link/:slug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let db;
        try {
            // create mysql-connection
            db = yield dbConnect();
            // validate
            const slug = req.params.slug && req.params.slug.toString().length < 255 ? req.params.slug : false;
            if (slug) {
                // valiation ok
                // query database for link
                const result = yield db.query("SELECT * FROM links WHERE slug = ? LIMIT 1", [slug]);
                if (result.length === 0) {
                    // fail, link does not exist
                    res.status(403).send({ error: "Link does not exist" });
                }
                else {
                    // get url to redirect to
                    const url = result[0].link;
                    // return redirect
                    res.writeHead(302, { "Location": url });
                    res.end();
                }
            }
            else {
                // validation failed
                res.status(403).send({ error: "Check required fields" });
            }
        }
        catch (error) {
            console.log(`Error ${error}`);
            // some server-error
            res.status(500).send();
        }
        finally {
            // close mysql-connection when finished
            yield db.close();
        }
    }));
    // create new link ( authorization required with token in header )
    app.post('/api/links/create', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // user is authenticated
        let db;
        try {
            // create mysql-connection
            db = yield dbConnect();
            // validate required
            const userId = req.body.userId && typeof parseInt(req.body.userId) === "number" ? parseInt(req.body.userId) : false;
            const link = req.body.link && req.body.link.toString().length < 255 ? req.body.link : false;
            if (userId && link) {
                // valiation ok
                // does link already exist?
                const exists = yield db.query("SELECT * FROM links WHERE link = ? AND user_id = ?", [link, userId]);
                if (exists.length > 0) {
                    // fail, user exists - return 409 conflict with a message
                    res.status(409).send({ error: "Link already exists" });
                }
                else {
                    // create new link
                    // create new slug which will be used for the short-url
                    const slug = (0, unique_slug_1.default)();
                    /*
                        Here we really should check if the slug really is unique and not already taken in the database
                    */
                    // insert into database
                    const result = yield db.query("INSERT INTO links(`link`,`user_id`, `slug`) VALUES(?,?,?)", [link, userId, slug]);
                    // all done, return 201 created
                    res.status(201).send({});
                }
            }
            else {
                // validation failed
                res.status(403).send({ error: "Check required fields" });
            }
        }
        catch (error) {
            console.log(`Error ${error}`);
            // some server-error
            res.status(500).send();
        }
        finally {
            // close mysql-connection when finished
            yield db.close();
        }
    }));
};
module.exports = linksRouter;

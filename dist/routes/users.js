"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const crypto_1 = __importDefault(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter = (app, dbConnect) => {
    // helper to create an MD5-hash
    const md5 = data => crypto_1.default.createHash('md5').update(data).digest("hex");
    // get .env-file
    dotenv_1.default.config();
    // create new user
    app.post('/api/users/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let db;
        try {
            // create mysql-connection
            db = yield dbConnect();
            // validate required
            const email = req.body.email && req.body.email.toString().length < 255 ? req.body.email : false;
            const password = req.body.password && req.body.password.toString().length >= 8 && req.body.password.toString().length <= 15 ? req.body.password : false;
            if (email && password) {
                // valiation ok
                // does user already exist?
                const exists = yield db.query("SELECT * FROM users WHERE email = ?", [email]);
                if (exists.length > 0) {
                    // fail, user exists - return 409 conflict with a message
                    res.status(409).send({ error: "User already exists" });
                }
                else {
                    // create a new token that expires in 2 hours
                    const token = jwt.sign({ user: email }, process.env.SECRET_TOKEN_KEY, { expiresIn: "2h" });
                    // insert into database and hash password
                    const result = yield db.query("INSERT INTO users(`email`,`password`,`token`) VALUES(?,?,?)", [email, md5(password), token]);
                    // all done, return 201 created with created login token and user id
                    res.status(201).send({ token: token, user_id: result.insertId });
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
    // login existing user
    app.post('/api/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let db;
        try {
            // create mysql-connection
            db = yield dbConnect();
            // validate required
            const email = req.body.email && req.body.email.toString().length < 255 ? req.body.email : false;
            const password = req.body.password && req.body.password.toString().length >= 8 && req.body.password.toString().length <= 15 ? req.body.password : false;
            if (email && password) {
                // valiation ok
                // query user
                const user = yield db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, md5(password)]);
                if (user.length > 0) {
                    // create a new jwt token
                    const token = jwt.sign({ user: email }, process.env.SECRET_TOKEN_KEY, { expiresIn: "2h" });
                    // update new token in db
                    const user_id = user[0].user_id;
                    const result = yield db.query("UPDATE users SET token = ? WHERE user_id = ?", [token, user_id]);
                    // all done, return 200 with login token and user id
                    res.status(200).send({ token: token, user_id: result.insertId });
                }
                else {
                    // no match, return 403 with a message
                    res.status(403).send({ error: "Email and/or password is incorrect" });
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
module.exports = userRouter;

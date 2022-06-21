import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import {errorMessage} from './types';

// express middleware to verify token
export const verifyToken = (req: Request, res: Response, next:NextFunction) => {
  const token: string | string[] = req.headers["authorization"] || req.headers["Authorization"];

  // no token sent?
  if (!token) {
    return res.status(403).send(<errorMessage>{error:"A token is required"});
  }

  // verify token
  try {
    // will throw error if not valid
    jwt.verify(token, process.env.SECRET_TOKEN_KEY);
  } catch (err) {
    // not valid
    return res.status(401).send(<errorMessage>{error:"Invalid Token"});
  }

  // continue to next
  return next();
};

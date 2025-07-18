import { JWT } from './config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from './types/auth';
import { ZodType } from 'zod';

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401); 

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT.SECRET_KEY) as JwtPayload;
    req.user = decoded; 
    next();
  } catch (err) {
    res.sendStatus(403); 
  }
}

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if(!result.success) {
    return res.status(400).json({ message: result.error.issues[0]['message']})
  }
 
  req.body = result.data;
  next(); 
}


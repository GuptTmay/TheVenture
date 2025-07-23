import { JWT } from "./config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "./types/auth";
import { ZodType } from "zod";
import { Status } from "./helper";

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT.SECRET_KEY) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expired: Refresh Page", status: Status.ERROR });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid token", status: Status.ERROR });
    }

    return res.status(403).json({ message: "Forbidden", status: Status.ERROR });
  }
}

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.issues.map((issue) => {
        const path = issue.path.join(".") || "Field";
        return `${path}: ${issue.message}`;
      });

      return res.status(400).json({
        message: formatted[0],
        status: Status.ERROR,
      });
    }

    req.body = result.data;
    next();
  };

import { JwtPayload } from './auth.d';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}



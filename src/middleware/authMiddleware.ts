import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/userModel";
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";

export interface AuthRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}

export enum Role {
  Admin = "admin",
  Customer = "customer",
}

class AuthMiddleware {
  async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // get token from user

    const token = req.headers.authorization;
    if (!token || token === undefined) {
      res.status(403).json({
        message: "Token not provided",
      });
      return;
    }
    // verify token if it is legit or tampered
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err, decoded: any) => {
        if (err) {
          res.status(403).json({
            message: "invalid token",
          });
        } else {
          // check if that decoded object id user exit or not
          try {
            const userData = await User.findByPk(decoded.id);
            if (!userData) {
              res.status(404).json({
                message: "no user with that token",
              });
              return;
            }
            req.user = userData;
            next();
          } catch (error) {
            res.status(500).json({
              message: "something went wrong",
            });
          }
        }
      }
    );
    // next
  }

  restrictTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: Next) => {
      let userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "You don't have promission",
        });
      } else {
        next();
      }
    };
  }
}

export default new AuthMiddleware();

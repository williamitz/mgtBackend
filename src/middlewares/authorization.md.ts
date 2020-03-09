import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { SEED_KEY } from '../global/enviroment';


 export const verifyToken = ( req: Request, res: Response, next: NextFunction ) => {
    let token = req.get('Authorization') || '';

    jwt.verify( token, SEED_KEY, (error: any, decoded: any) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error
            });
        }

        req.body.userData = decoded.userDB;
        
        next();
    });
};


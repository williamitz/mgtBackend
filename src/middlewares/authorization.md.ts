import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { SEED_KEY } from '../global/enviroment';

 export const verifyToken = ( req: any, res: Response, next: NextFunction ) => {
    let token = req.get('Authorization') || '';

    jwt.verify( token, SEED_KEY, (error: any, decoded: any) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error
            });
        }

        req.user = decoded.userDB;
        
        next();
    });
};

export const verifyTokenUrl = ( req: any, res: Response, next: NextFunction ) => {
    let token = req.query.token || 'xD';

    jwt.verify( token, SEED_KEY, (error: any, decoded: any) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error
            });
        }
        
        req.user = decoded;
        next();
        
    });
};


import jwt from 'jsonwebtoken';
import { Router, Request, Response} from 'express';
import { SEED_KEY } from '../global/enviroment';

let AuthRoutes = Router();

AuthRoutes.post( '/authentication', (req: Request, res: Response) => {
    let token = req.get('Authorization') || '';

    jwt.verify( token, SEED_KEY, (error: any, decoded) => {
        // console.log(token);

        if (error) {
            return res.json({
                ok: false,
                error,
                message: 'Credenciales inválidas'
            });
        }

        res.json({
            ok: true,
            message: 'Credenciales válidas'
        });

    });
});

export default AuthRoutes;
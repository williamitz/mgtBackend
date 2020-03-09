import { Router, Request, Response } from 'express';
import requestIp from 'request-ip';
import { User } from '../models/user.model';
import { ResponsePromise } from '../interfaces/entitys.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SEED_KEY } from '../global/enviroment';


const UserRoutes = Router();

UserRoutes.post('/singIn', async (req: Request, res: Response) => {
    let body = req.body;

    let resVerify = await verifyUser( body.nameUser );

    if (!resVerify.ok) {
        return res.status(400).json({
            ok: false,
            error: resVerify.error
        });
    }

    if (resVerify.ok && resVerify.showError !== 0) {
        return res.json({
            ok: true,
            error: {
                message: resVerify.message
            },
            showError: resVerify.showError
        });
    }
    
    let newUser = new User({
        name : body.name,
        surname : body.surname,
        nameComplete : `${ body.surname }, ${ body.name }`,
        nameUser : body.nameUser,
        passwordUser : bcrypt.hashSync( body.passwordUser, 10),
        registered : {
            date: Date.now,
            ip: requestIp.getClientIp( req )
        }
    });

    newUser.save( (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            data: userDB,
            showError: resVerify.showError
        });
    });
});


UserRoutes.post('/login', (req: Request, res: Response) => {
    let body = req.body;

    User.findOne( { nameUser: body.nameUser }, [], async (err: any, userDB: any) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        let showError = 0;
        if (!userDB) {
            return res.json({ ok: true, showError: 1 });
        }

        if (!userDB.statusRegister) {
            return res.json({ ok: true, showError: 2 });
        }

        if ( !bcrypt.compareSync( body.passwordUser, userDB.passwordUser ) ) {
            return res.json({ ok: true, showError: 4 });
        }

        userDB.passwordUser = null;

        console.log('user db', userDB);

        let token: string = await jwt.sign( {userDB}, SEED_KEY, { expiresIn: '1d' } );

        console.log(token);

        res.json({
            ok: true,
            showError,
            data: userDB,
            token
        });
    });
});

function verifyUser( nameUser: string ): Promise<ResponsePromise> {

    return new Promise( (resolve) => {
        User.findOne( { nameUser }, ['statusRegister'], (err: any, userDB: any ) => {
            if (err) {
                resolve( { ok: false, error: err, message: 'Error interno del servidor, al validar usuario' } )
            }
    
            let showError = 0;

            if (userDB) {

                showError += 1;
                
                if (!userDB.statusRegister) {
                    showError += 2;
                }
            }


            resolve( { ok: true, message: '', showError } );
        });
    });

}

export default UserRoutes;
import { Router, Request, Response } from 'express';
import requestIp from 'request-ip';
import { User } from '../models/user.model';
import { ResponsePromise } from '../interfaces/entitys.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SEED_KEY } from '../global/enviroment';
import { verifyToken } from '../middlewares/authorization.md';
import { Document } from 'mongoose';

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
    
    let newUser = {
        name : body.name,
        surname : body.surname,
        nameComplete : `${ body.surname }, ${ body.name }`,
        nameUser : body.nameUser,
        passwordUser : bcrypt.hashSync( body.passwordUser, 10),
        registered : {
            date: Date.now,
            ip: requestIp.getClientIp( req )
        }
    };

    User.create( newUser ).then( userDB => {
        
        res.json({
            ok: true,
            data: userDB,
            showError: resVerify.showError
        });

    }).catch( err => {
        
        return res.status(400).json({
            ok: false,
            error: err
        });
        
    });        

});


UserRoutes.post('/login', (req: Request, res: Response) => {
    let body = req.body;

    User.findOne( { nameUser: body.nameUser }, [], async (err, userDB) => {
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

        if ( !userDB.comparePassword( body.passwordUser ) ) {
            return res.json({ ok: true, showError: 4 });
        }

        userDB.passwordUser = '';

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

UserRoutes.get('/profile/get', [verifyToken], (req: Request, res: Response) => {
    
    let dataUser = req.body.userData;
    // console.log(dataUser);

    User.findOne( { _id : dataUser._id }, [], (error: any, userDB: any) => {

        if (error) {
            return res.status(400).json({
                ok: true,
                error
            });
        }

        userDB.passwordUser = '';

        res.json({
            ok: true,
            data: userDB
        });
    });
    
});

UserRoutes.post('/profile/update', [verifyToken], (req: Request, res: Response) => {
    let body = req.body;
    let dataUser = req.body.userData;

    let arrUpdate = {
        $set: {
            name: body.name,
            surname: body.surname,
            nameComplete: `${ body.surname }, ${ body.name }`,
            email: body.email,
            phone: body.phone,
            sex: body.sex,
            dateBorn: body.dateBorn,
            aboutMe: body.aboutMe
        }
    }

    User.update( { _id: dataUser._id }, arrUpdate, (error, userDB) =>  {

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontró regoistro de usuario'
                }
            });
        }

        res.json({
            ok: true,
            data: userDB
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
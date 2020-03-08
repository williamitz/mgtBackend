import { Router, Request, Response } from 'express';
import requestIp from 'request-ip';
import { User } from '../models/user.model';
import { ResponsePromise } from '../interfaces/entitys.interface';


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
        return res.status(400).json({
            ok: false,
            error: {
                message: resVerify.message
            }
        });
    }
    
    let newUser = new User({
        name : body.name,
        surname : body.surname,
        nameComplete : `${ body.surname }, ${ body.name }`,
        nameUser : body.nameUser,
        passwordUser : body.passwordUser,
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
                
                if (userDB.statusRegister) {
                    showError += 2;
                }
            }


            resolve( { ok: true, message: '', showError } );
        })
    });

}

export default UserRoutes;
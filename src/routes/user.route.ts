import { Router, Request, Response } from 'express';
import requestIp from 'request-ip';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { mongo } from 'mongoose';
import { SEED_KEY } from '../global/enviroment';
import { verifyToken } from '../middlewares/authorization.md';

import { ResponsePromise } from '../interfaces/entitys.interface';
import { User } from '../models/user.model';
import { Comunity } from '../models/comunity.model';
import { Post } from '../models/post.model';

const UserRoutes = Router();

UserRoutes.post('/singIn', async (req: Request, res: Response) => {
    let body = req.body;
    
    let sexValid = ['F', 'M', 'O'];

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

    if (sexValid.indexOf( body.sex ) < 0) {
        return res.json({
            ok: true,
            showError: 4
        });
    }
    
    let newUser = {
        name : body.name,
        surname : body.surname,
        nameComplete : `${ body.surname }, ${ body.name }`,
        nameUser : body.nameUser,
        imgUser: body.imgUser,
        sex: body.sex,
        passwordUser : bcrypt.hashSync( body.passwordUser, 10),
        accountPrivate: body.accountPrivate,
        registered : {
            date: new Date(),
            ipUser: requestIp.getClientIp( req )
        }
    };

    User.create( newUser ).then( async (userDB) => {

        let token = await jwt.sign( {userDB}, SEED_KEY, {expiresIn: '1d'}  );

        let comunity = {
            user: userDB._id, 
            followers: [], 
            followed: [],
            registered: {
                date: new Date(),
                idUser: userDB._id,
                ipUser: requestIp.getClientIp( req )
            }
        };
        await Comunity.create( comunity );
        
        res.json({
            ok: true,
            data: userDB,
            token,
            showError: 0
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

        let token: string = await jwt.sign( {userDB}, SEED_KEY, { expiresIn: '1d' } );

        res.json({
            ok: true,
            showError,
            data: userDB,
            token
        });
    });
});

UserRoutes.get('/profile/get', [verifyToken], (req: any, res: Response) => {
    
    let idUser = req.user._id;
    // console.log(dataUser);

    User.findOne( { _id : idUser }, [], (error: any, userDB: any) => {

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

UserRoutes.get('/profileInfo/:id', [verifyToken], (req: any, res: Response) => {
    let userToken = req.user._id;
    let idUser = req.params.id || '';
    let arrWhere = { 
        _id: mongoose.Types.ObjectId( idUser ),
        statusRegister: true
    };
    let arrProject = [
        'nameComplete',
        'nameUser',
        'accountPrivate',
        'registered',
        'imgUser',
        'aboutMe'
    ];
    User.findOne( arrWhere, arrProject, (error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok:false,
                error
            });
        }
        
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontró registro de usuario'
                }
            });
        }
        const arrWhereProfile = { user: mongoose.Types.ObjectId( idUser ) };
        Comunity.findOne( arrWhereProfile, [], async (errorComunity, comunityDB)  => {
            if (errorComunity) {
                return res.status(400).json({
                    ok:false,
                    error: errorComunity
                });
            }

            let myComunity = await Comunity.findOne( {user: mongoose.Types.ObjectId( userToken )}, ['followed'] );
            // console.log('my conunity', myComunity);
            // console.log('find', idUser);
            let arrMyFollowed = myComunity.followed || [];
            let followed = false;
            arrMyFollowed.forEach( follower => {
                console.log(follower.user, ' = ' , idUser );
                if (follower.user.toHexString() === idUser ) {
                    followed = true;
                    console.log('encontrado', follower.user);
                }
            });
            
            let post: any[] = [];
            if (!userDB.accountPrivate) {
                Post.find( arrWhereProfile, [], (errorPost, postDB) => {
                    if (errorPost) {
                        return res.status(400).json({
                            ok:false,
                            error: errorPost
                        });
                    }

                    if (!postDB) {
                        post = [];
                    } else {
                        post = postDB;
                    }

                    return res.json({
                        ok: true,
                        followed,
                        user: userDB,
                        comunity: comunityDB,
                        post
                    })
                });
            } else {
                res.json({
                    ok: true,
                    user: userDB,
                    comunity: comunityDB,
                });
            }
        });

    });
});

UserRoutes.post('/profile/update', [verifyToken], (req: any, res: Response) => {
    let body = req.body;
    let idUser = req.user._id;

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

    User.update( { _id: idUser }, arrUpdate, (error, userDB) =>  {

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
        User.findOne( { nameUser }, (err: any, userDB ) => {
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
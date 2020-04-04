import { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/authorization.md';
import { Comunity } from '../models/comunity.model';
import { User } from '../models/user.model';
import mongoose from 'mongoose';
import { IResPromise } from '../interfaces/resPromise.interface';

const ComunityRoute = Router();

// seguir a una persona

ComunityRoute.post('/Comunity/AddFollowed', [verifyToken], (req: any, res: Response) => {

    let idUser: string = req.user._id;
    let body = req.body; 
    let idFollowed: string = body.idFollowed || '';

    let arrWhere = { 
        user: mongoose.Types.ObjectId( idUser ), 
        statusRegister: true 
    };
    
    Comunity.findOne( arrWhere, [], (error, comunityDB) => {
        if (error) {
            return res.status(400).json({ 
                ok: false,
                error
            });
        }

        let newFollowed = { user: mongoose.Types.ObjectId( idFollowed ), dateFollow: new Date(), locked: false };
        comunityDB.followed.push( newFollowed );
        
        comunityDB.save( async (error: any, comunityUpdate: any) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            let resFollowerMe = await addFollowerFollowed( idFollowed, idUser );

            if (!resFollowerMe.ok) {
                return res.status(400).json({
                    ok: false,
                    error: resFollowerMe.error
                });
            }

            res.json({
                ok: true,
                data: resFollowerMe.data
            });

        });

    });

});

ComunityRoute.post('/Comunity/RemoveFollowed', [verifyToken], (req: any, res: Response) => {
    let idUser: string = req.user._id;
    let body = req.body;
    let idFollowed: string = body.idFollowed || '';

    let arrWhere = { 
        user: mongoose.Types.ObjectId( idUser ), 
        statusRegister: true 
    };
    
    Comunity.findOne( arrWhere, [], (error, comunityDB) => {
        if (error) {
            return res.status(400).json({ 
                ok: false,
                error
            });
        } 

        let indexRemove = comunityDB.followed.findIndex( followed => followed.user.toHexString() === idFollowed );
        // comunityDB.followed.forEach( (followed) => { 
        //     indexRemove ++;
        //     if ( followed.user.toHexString() === idFollowed  ) {
        //         return;
        //     }
        // });

        if (indexRemove >= 0) {
            comunityDB.followed[ indexRemove ] = null;
            comunityDB.followed = comunityDB.followed.filter( (user) => user !== null );
        }

        comunityDB.save( async (error: any, comunityUpdate: any) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            let resFollowerMe = await removeFollowerFollowed( idFollowed, idUser );

            if (!resFollowerMe.ok) {
                return res.status(400).json({
                    ok: false,
                    error: resFollowerMe.error
                });
            }

            res.json({
                ok: true,
                data: resFollowerMe.data
            });

        });

    });
    
});

// agregarme como seguidor de la persona seguida

function addFollowerFollowed( idFollowed: string, idUser: string): Promise<IResPromise> {
    return new Promise( (resolve) => {
        
        let arrWhere = { user: mongoose.Types.ObjectId( idFollowed ) };

        Comunity.findOne( arrWhere, [], ( error, comunityDB ) => {
            if (error) {
                resolve( { ok: false, error } );
            }

            if (!comunityDB) {
                resolve( { ok: false, error: { message: 'No se encontró comunidad del usuario a seguir' } } );
            }

            let arrFollower = { 
                user: new mongoose.Types.ObjectId( idUser ), 
                dateFollow: new Date(),
                locked: false
            };

            comunityDB.followers.push( arrFollower );
            comunityDB.save( (error, comunityUpdate) => {
                console.log('update',comunityUpdate);
                if (error) {
                    resolve( { ok: false, message: 'Error al agregarme como seguidor' } );
                }

                resolve( {ok: true, data: comunityUpdate } );
            });
        });

    });
}

// quitarme como seguidor de la persona seguida

function removeFollowerFollowed( idFollowed: string, idUser: string): Promise<IResPromise> {
    return new Promise( (resolve) => {

        let arrWhere = { 
            user: mongoose.Types.ObjectId( idFollowed ),
            statusRegister: true
        };

        Comunity.findOne( arrWhere, [], ( error, comunityDB ) => {
            if (error) {
                resolve( { ok: false, error } );
            }

            if (!comunityDB) {
                resolve( { ok: false, error: { message: 'No se encontró comunidad del usuario a seguir' } } );
            }

            let indexRemove = comunityDB.followers.findIndex( follower => follower.user.toHexString() === idUser );
            // comunityDB.followers.forEach( (follower) => {
            //     indexRemove++;
            //     if ( follower.user.toHexString() === idUser) {
            //         return;
            //     }

            // });

            if (indexRemove >= 0) {                
                comunityDB.followers[ indexRemove ] = null;
                comunityDB.followers = comunityDB.followers.filter( (user: any) => user !== null );
            }

            comunityDB.save( (error: any, comunityUpdate: any) => {
                if (error) {
                    resolve( { ok: false, error, message: 'Error al eliminarme como seguidor' } );
                }

                resolve( {ok: true, data: comunityUpdate } );
            });
        });

    });
}

ComunityRoute.get('/Comunity/newFollow', [verifyToken], (req: any, res: Response) => {

    let idUser = req.user._id;

    Comunity.aggregate( [{ $match: { user: mongoose.Types.ObjectId( idUser ) } }] )
            // .match( { user: idUser } )
            .project({'followed': 1})
            .unwind('$followed')
            .exec( async (error: any, result) => {
                
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error
                    });
                }
                
                let arrFollowed: mongoose.Types.ObjectId[] = [];
                result.forEach( element => {
                    arrFollowed.push( element.followed.user );
                });
            
                let users = await User.find({}, ['nameComplete', 'nameUser', 'imgUser'])
                .where('_id')
                .ne( idUser )
                .nin( arrFollowed )
                .sort({registered: -1});
                
                res.json({
                    ok: true,
                    data: users
                });

            });

});

export default ComunityRoute;
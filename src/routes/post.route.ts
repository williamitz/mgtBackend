import { Router, Request, Response } from 'express';
import { verifyToken, verifyTokenUrl } from '../middlewares/authorization.md';
import { Post } from '../models/post.model';
import { UploadedFile } from 'express-fileupload';
import FileSystem from '../classes/file-system';
import { IResPromise } from '../interfaces/resPromise.interface';

const PostRoutes = Router();

const fileSystem = new FileSystem();

PostRoutes.post('/post/add', [verifyToken], (req: any, res: Response) => {
    let body = req.body;

    body.user = req.user._id;

    let imgPost = fileSystem.moveImgTempInPost( req.user._id );
    body.img = imgPost;

    Post.create( body ).then( async (postDB) => {

        await postDB.populate('user','-passwordUser').execPopulate();

        res.json({
            ok: true,
            data: postDB
        });

    }).catch( error  => {
        res.status(400).json({
            ok: false,
            error
        });
    });

});

PostRoutes.get('/post/get', [verifyToken], (req: any, res: Response) => {
    let page = req.query.page || 1;
    let skip = (page - 1) * 10;

    Post.find( { user: req.user._id }, [], async (error, documents) => {
        if (error) {
            return res.status(400).json({
                ok: true,
                error
            });
        }

        res.json({
            ok: true,
            data: documents,
            total: await Post.countDocuments( { user: req.user._id } ).exec()
        });
        
    }).sort( { created: -1 } )
    .skip( skip )
    .limit( 10 )
    .populate('user', '-passwordUser');
});

//servicio para subir archivos
PostRoutes.post( '/upload', [verifyToken], (req: any, res: Response) => {

    if (! req.files ) {
        return res.status(400).json({
             ok: false,
             error: {
                 message: 'No se cargaron archivos para subir'
             }
        });
    }

    let file: UploadedFile = req.files.image;

    if (!file) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se cargaron archivos para subir'
            }
        });
    }
     
    let validTypes = ['png', 'jpg', 'jpeg'];
    let nameFile = file.name;
    let arrNameFile = nameFile.split('.');
    let extensionFile = arrNameFile[ arrNameFile.length - 1 ].toLowerCase();

     if ( validTypes.indexOf( extensionFile ) < 0 ) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Solo se aceptan archivos de tipo ' + validTypes.join(', ')
            }
        });
     }

     let userId = req.user._id;

     fileSystem.saveImageTemp( file, extensionFile, userId ).then( (resUpload: IResPromise) => {

         res.json( resUpload );

     }).catch( ( resError: IResPromise ) => {

        res.status(400).json( resError );

     });


});

PostRoutes.get('/image/:user/:img', [verifyTokenUrl], (req: Request, res: Response) => {

    let userId = req.params.user || 'xD';
    let srcImg = req.params.img || 'xD';

    let pathImg = fileSystem.getPathImgUploaded( userId, srcImg );

    res.sendFile( pathImg );
});

export default PostRoutes;
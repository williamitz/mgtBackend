import { Router, Request, Response } from 'express';
import { verifyToken } from '../middlewares/authorization.md';
import { Post } from '../models/post.model';

const PostRoutes = Router();

PostRoutes.post('/post/add', [verifyToken], (req: any, res: Response) => {
    let body = req.body;

    body.user = req.user._id;

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

export default PostRoutes;
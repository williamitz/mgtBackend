

import { Request, Response, Router} from 'express';


const router = Router();

router.post( '/login', (req: Request, res: Response) => {
    res.json({
        ok: true,
        message: 'Hola desde backend'
    });
});

export default router;
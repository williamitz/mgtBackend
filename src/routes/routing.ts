

import { Request, Response, Router} from 'express';
import UserRoutes from './user.route';
import PostRoutes from './post.route';


const AppRouter = Router();

AppRouter.use( UserRoutes )
AppRouter.use( PostRoutes );

export default AppRouter;
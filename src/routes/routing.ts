import { Router } from 'express';
import UserRoutes from './user.route';
import PostRoutes from './post.route';
import AuthRoutes from './authorization.route';
import ComunityRoute from './comunity.route';

const AppRouter = Router();

AppRouter.use( UserRoutes );
AppRouter.use( PostRoutes );
AppRouter.use( AuthRoutes );
AppRouter.use( ComunityRoute );

export default AppRouter;
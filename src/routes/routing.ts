

import { Request, Response, Router} from 'express';
import UserRoutes from './user.route';


const AppRouter = Router();

AppRouter.use( UserRoutes )

export default AppRouter;
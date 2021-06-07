import {Router} from 'express';
import {Segments, Joi, celebrate} from 'celebrate';

import SessionController from '../controllers/SessionController';

const sessionController = new SessionController();

const sessionsRouter = Router();

sessionsRouter.post('/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6)
        }
    }),
    sessionController.create);

export default sessionsRouter;
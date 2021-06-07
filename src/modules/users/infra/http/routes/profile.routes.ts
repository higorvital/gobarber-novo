import {Router} from 'express';
import {Segments, Joi, celebrate} from 'celebrate';

import authMiddleware from '../../../../../shared/infra/http/middlewares/auth';
import ProfileController from '../controllers/ProfileController';
const profileController = new ProfileController();

const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get('/', profileController.show)
profileRouter.put('/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().required(),
            old_password: Joi.string(),
            password: Joi
                .string()
                .when('old_password', {
                    is: Joi.exist(),
                    then: Joi.string().required().min(6),
                    otherwise: Joi.string(),
                }),
            password_confirmation: Joi.string().valid(Joi.ref('password'))
        }
    }),
    profileController.update)

export default profileRouter;
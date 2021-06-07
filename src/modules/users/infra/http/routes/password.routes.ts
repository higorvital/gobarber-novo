import {Router} from 'express';
import {Segments, Joi, celebrate} from 'celebrate';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

const passwordRouter = Router();

passwordRouter.post('/forgot',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required()
        }
    }),
    forgotPasswordController.create);

passwordRouter.post('/reset',
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().uuid().required(),
            password: Joi.string().required().min(6),
            password_confirmation: Joi.string().valid(Joi.ref('password'))
        }
    }),
    resetPasswordController.create);

export default passwordRouter;
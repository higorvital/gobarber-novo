import {Router} from 'express';
import multer from 'multer';
import {Segments, Joi, celebrate} from 'celebrate';

import multerConfig from '../../../../../config/multer';
import authMiddleware from '../../../../../shared/infra/http/middlewares/auth';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();


const usersRouter = Router();
const upload = multer(multerConfig);

usersRouter.post('/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6)
        }
    }),
    usersController.create);

usersRouter.use(authMiddleware);

usersRouter.patch('/avatar', upload.single('avatar'), userAvatarController.update)

export default usersRouter;
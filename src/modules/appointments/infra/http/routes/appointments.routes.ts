import {Router} from 'express';
import {Segments, Joi, celebrate} from 'celebrate';

import authMiddleware from '../../../../../shared/infra/http/middlewares/auth';

import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

const appoitmentsRouter = Router();

appoitmentsRouter.use(authMiddleware);

appoitmentsRouter.get('/', appointmentsController.index)
appoitmentsRouter.get('/me', providerAppointmentsController.index)

appoitmentsRouter.post('/',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            date: Joi.date().required()
        }
    }),
    appointmentsController.create);

export default appoitmentsRouter;
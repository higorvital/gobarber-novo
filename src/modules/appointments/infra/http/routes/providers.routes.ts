import {Router} from 'express';
import {Segments, Joi, celebrate} from 'celebrate';

import authMiddleware from '../../../../../shared/infra/http/middlewares/auth';
import ProviderDayController from '../controllers/ProviderDayController';
import ProviderMonthController from '../controllers/ProviderMonthController';

import ProvidersController from '../controllers/ProvidersController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const providersController = new ProvidersController();
const providersDayController = new ProviderDayController();
const providersMonthController = new ProviderMonthController();
const providerAppointmentsController = new ProviderAppointmentsController()
const providersRouter = Router();

providersRouter.use(authMiddleware);

providersRouter.get('/', providersController.show)
providersRouter.get('/:provider_id/day-availability',
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        }
    }),
    providersDayController.index)
providersRouter.get('/:provider_id/month-availability', providersMonthController.index)
providersRouter.get('/appointments', providerAppointmentsController.index)

export default providersRouter;
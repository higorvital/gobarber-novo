import {Request, Response} from 'express';
import {container} from 'tsyringe';
import { isUuid } from 'uuidv4';

import ListProvidersMonthAvailabilityService from '../../../services/ListProvidersMonthAvailabilityService';


class ProviderMonthController{

    async index(request: Request, response: Response){

        const {provider_id} = request.params;
        const {month, year} = request.query;

        const listProviderMonthService = container.resolve(ListProvidersMonthAvailabilityService);

        const appointments = await listProviderMonthService.execute({provider_id,
            year: Number(year),
            month:Number(month)
        });

        return response.status(200).json(appointments);
    }

}

export default ProviderMonthController;
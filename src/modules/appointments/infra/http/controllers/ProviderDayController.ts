import {Request, Response} from 'express';
import {container} from 'tsyringe';

import ListProvidersDayAvailabilityService from '../../../services/ListProvidersDayAvailabilityService';


class ProviderDayController{


    async index(request: Request, response: Response){

        const {provider_id} = request.params;
        const {month, day, year} = request.query

        const listProviderDayService = container.resolve(ListProvidersDayAvailabilityService);

        const appointments = await listProviderDayService.execute({
            provider_id,
            year: Number(year),
            month:Number(month),
            day: Number(day)
        });

        return response.status(200).json(appointments);
    }

}

export default ProviderDayController;
import {Request, Response} from 'express';
import {container} from 'tsyringe';

import ListProvidersAppointmentsService from '../../../services/ListProviderAppointmentsService';


class ProviderAppointmentsController{


    async index(request: Request, response: Response){

        const {month, day, year} = request.query;
        
        const listProviderAppointmentsService = container.resolve(ListProvidersAppointmentsService);

        const appointments = await listProviderAppointmentsService.execute({provider_id: request.user.id, year: Number(year), month: Number(month), day: Number(day)});

        return response.status(200).json(appointments);
    }

}

export default ProviderAppointmentsController;
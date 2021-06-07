import {Request, Response} from 'express';
import {parseISO} from 'date-fns';
import {container} from 'tsyringe';

import CreateAppointmentsService from '../../../services/CreateAppointmentsService';


class AppointmentsController{

    async index(request: Request, response: Response){
        // const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    
        // const appointments = await appointmentsRepository.find();

        // return response.status(200).json(appointments); 
    
    }

    async create(request: Request, response: Response){

        const {provider_id, date} = request.body;

        // const parsedDate = parseISO(date);
        const parsedDate = date;

        const createAppointments = container.resolve(CreateAppointmentsService);

        const appointment = await createAppointments.execute({provider_id, date: parsedDate, user_id: request.user.id});

        return response.status(200).json(appointment);
    }

}

export default AppointmentsController;
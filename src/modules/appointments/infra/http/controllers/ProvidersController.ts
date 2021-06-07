import { classToClass } from 'class-transformer';
import {Request, Response} from 'express';
import {container} from 'tsyringe';

import ListProvidersService from '../../../services/ListProvidersService';


class ProvidersController{

    async show(request: Request, response: Response){

        const listProvidersService = container.resolve(ListProvidersService);

        const users = await listProvidersService.execute(request.user.id);

        return response.status(200).json(classToClass(users));
    
    }


}

export default ProvidersController;
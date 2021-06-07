import { classToClass } from 'class-transformer';
import {Request, Response} from 'express';

import {container} from 'tsyringe';
import ShowUserService from '../../../services/ShowUserService';
import UpdateUserService from '../../../services/UpdateUserService';


class ProfileController{

    async show(request: Request, response: Response){
        const showUserService = container.resolve(ShowUserService);
    
        const user = await showUserService.execute(request.user.id);
        
        return response.status(200).json(classToClass(user));

    }

    async update(request: Request, response: Response){
        const {name, email, password, old_password} = request.body;

        const updateUserService = container.resolve(UpdateUserService);
    
        const user = await updateUserService.execute({user_id: request.user.id, name, email, password, old_password});
        
        return response.status(200).json(classToClass(user));
    
    }
}

export default ProfileController;
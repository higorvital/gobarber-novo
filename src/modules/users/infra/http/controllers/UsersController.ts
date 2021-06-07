import {Request, Response} from 'express';

import {container} from 'tsyringe';
import CreateUsersService from '../../../services/CreateUsersService';
import {classToClass} from 'class-transformer';

class UsersController{
    async create(request: Request, response: Response){
        const {name, email, password} = request.body;

        const createUserService = container.resolve(CreateUsersService);
    
        const user = await createUserService.execute({name, email, password});
    
        return response.status(200).json(classToClass(user));
    
    }
}

export default UsersController;
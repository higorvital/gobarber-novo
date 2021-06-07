import { classToClass } from 'class-transformer';
import {Request, Response} from 'express';
import {container} from 'tsyringe';

import AuthenticateUserService from '../../../services/AuthenticateUserService';


class SessionController{
    async create(request: Request, response: Response){

        const {email, password} = request.body;

        const authService = container.resolve(AuthenticateUserService);

        const {user, token} = await authService.execute({email, password});
    
        
        return response.status(200).json({
            user: classToClass(user),
            token
        });
    
    }
}

export default SessionController;
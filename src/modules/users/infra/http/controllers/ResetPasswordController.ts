import {Request, Response} from 'express';

import {container} from 'tsyringe';
import ResetPasswordService from '../../../services/ResetPasswordService';


class ResetPasswordController{
    async create(request: Request, response: Response){
        const {token, password, password_confirmation} = request.body;

        const resetPasswordMailService = container.resolve(ResetPasswordService);

        await resetPasswordMailService.execute({token, password, password_confirmation});

        return response.status(204).json();
    
    }
}

export default ResetPasswordController;
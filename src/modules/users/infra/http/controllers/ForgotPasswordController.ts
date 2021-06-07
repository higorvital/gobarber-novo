import {Request, Response} from 'express';

import {container} from 'tsyringe';
import SendForgotPasswordEmailService from '../../../services/SendForgotPasswordEmailService';


class ForgotPasswordController{
    async create(request: Request, response: Response){
        const {email} = request.body;

        const sendForgotPasswordMailService = container.resolve(SendForgotPasswordEmailService);

        await sendForgotPasswordMailService.execute(email);
    
        return response.status(204).json();
    }
}

export default ForgotPasswordController;
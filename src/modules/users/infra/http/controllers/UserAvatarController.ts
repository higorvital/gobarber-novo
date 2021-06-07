import { classToClass } from 'class-transformer';
import {Request, Response} from 'express';
import {container} from 'tsyringe';

import UploadAvatarService from '../../../services/UploadAvatarService';

class UserAvatarController{
    async update(request: Request, response: Response){
    
        const filename = request.file.filename;

        const uploadAvatarService = container.resolve(UploadAvatarService);

        const user = await uploadAvatarService.execute({user_id: request.user.id, filename});
        
        return response.status(200).json(classToClass(user));
            
    }
}

export default UserAvatarController;
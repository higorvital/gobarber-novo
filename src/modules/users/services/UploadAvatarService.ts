import path from 'path';
import fs from 'fs';
import {inject, injectable} from 'tsyringe';
import User from '../infra/typeorm/models/User';
import multerConfig from '../../../config/multer';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';


interface UploadAvatarServiceDTO{
    user_id: string,
    filename: string
}

@injectable()
class UploadAvatarService{

    private usersRepository: IUsersRepository;
    private storageProvider: IStorageProvider;
    
    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository,
        @inject('StorageProvider')
        storageProvider: IStorageProvider
    ){
        this.usersRepository = usersRepository;
        this.storageProvider = storageProvider;

    }

    public async execute({user_id, filename}:UploadAvatarServiceDTO) : Promise<User>{

        const user = await this.usersRepository.findById(user_id);

        if(!user){
            throw new AppError("Avatar só pode ser atualizado por usuário cadastrado", 401);
        }

        if(user.avatar){
            // fs.exists(userAvatarFilePath, async (fileExists)=>{
            //     if(fileExists){
            //         await fs.promises.unlink(userAvatarFilePath);

            //     }
            // })
            await this.storageProvider.deleteFile(user.avatar);
        }

        await this.storageProvider.saveFile(filename);

        user.avatar = filename;

        await this.usersRepository.save(user);

        return user;

    }
}

export default UploadAvatarService;
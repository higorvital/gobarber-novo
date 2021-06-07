import path from 'path';
import fs from 'fs';
import {inject, injectable} from 'tsyringe';
import User from '../infra/typeorm/models/User';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';
import IHashProvider from '../providers/IHashProvider';


interface UpdateUserServiceDTO{
    user_id: string;
    name: string;
    email: string
    password?: string
    old_password?: string

}

@injectable()
class UpdateUserService{

    private usersRepository: IUsersRepository;
    private hashProvider: IHashProvider;
    
    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository,
        @inject('HashProvider')
        hashProvider: IHashProvider
    ){
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;

    }

    public async execute({user_id, name, email, password, old_password}:UpdateUserServiceDTO) : Promise<User>{

        const user = await this.usersRepository.findById(user_id);

        if(!user){
            throw new AppError('Usuario não existe', 401);
        }

        const userWithEmail = await this.usersRepository.findByEmail(email);

        if(userWithEmail && userWithEmail.id !== user_id){
            throw new AppError('E-mail já cadastrado', 401);
        }

        user.name = name;
        user.email = email;

        if(password){

            if(!old_password){

                throw new AppError('Senha antiga deve ser informada para a atualização da senha', 401);            
            }

            const oldPasswordCorrect = await this.hashProvider.compareHash(old_password, user.password);

            if(!oldPasswordCorrect){
                throw new AppError('Senha antiga incorreta', 401);
            }

            user.password = await this.hashProvider.generateHash(password);

        }

        await this.usersRepository.save(user);

        return user;


    }
}

export default UpdateUserService;
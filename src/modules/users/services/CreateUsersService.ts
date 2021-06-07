import {inject, injectable} from 'tsyringe';

import User from '../infra/typeorm/models/User';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/IHashProvider';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

interface CreateUsersServiceDTO{
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUsersService{

    private usersRepository: IUsersRepository;
    private hashProvider: IHashProvider;
    private cacheProvider: ICacheProvider;

    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository,
        @inject('HashProvider')
        hashProvider: IHashProvider,
        @inject('CacheProvider')
        cacheProvider: ICacheProvider
    ){
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.cacheProvider = cacheProvider;

    }

    public async execute({name, email, password}:CreateUsersServiceDTO) : Promise<User>{

        const userExists = await this.usersRepository.findByEmail(email);

        if(userExists){
            throw new AppError("E-mail já cadastrado", 401);
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = this.usersRepository.create({
            name, 
            email, 
            password: hashedPassword
        });

        await this.cacheProvider.invalidatePrefix('provider-list');

        return user;

    }
}

export default CreateUsersService;
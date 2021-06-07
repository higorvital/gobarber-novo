import { classToClass } from 'class-transformer';
import {inject, injectable} from 'tsyringe';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '../../../shared/errors/AppError';
import User from '../../users/infra/typeorm/models/User'
import IUsersRepository from '../../users/repositories/IUsersRepository';

@injectable()
class ListProvidersService{

    private usersRepository: IUsersRepository;
    private cacheProvider: ICacheProvider;

    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository,
        @inject('CacheProvider')
        cacheProvider: ICacheProvider
    ){
        this.usersRepository = usersRepository;
        this.cacheProvider = cacheProvider;

    }

    public async execute(user_id: string) : Promise<User[]>{

        let users = await this.cacheProvider.recover<User[]>(`provider-list:${user_id}`);

        // let users;
        
        if(!users){
            
            users = await this.usersRepository.findAllProviders({
                exceptd_user_id: user_id
            });

            await this.cacheProvider.save(`provider-list:${user_id}`, classToClass(users));
    
        }

        return users;

    }
}

export default ListProvidersService;
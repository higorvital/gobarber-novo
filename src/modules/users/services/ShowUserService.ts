import {inject, injectable} from 'tsyringe';
import User from '../infra/typeorm/models/User';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';


@injectable()
class ShowUserService{

    private usersRepository: IUsersRepository;
    
    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository
    ){
        this.usersRepository = usersRepository;

    }

    public async execute(user_id: string) : Promise<User>{

        const user = await this.usersRepository.findById(user_id);

        if(!user){
            throw new AppError('Usuario não existe', 401);
        }

        return user;

    }
}

export default ShowUserService;
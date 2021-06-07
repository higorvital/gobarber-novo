import {inject, injectable} from 'tsyringe';
import {isAfter, addHours} from 'date-fns';
import AppError from '../../../shared/errors/AppError';
import IHashProvider from '../providers/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface RequestDTO{
    token: string;
    password: string;
    password_confirmation: string;
}

@injectable()
class ResetPasswordService{

    private usersRepository: IUsersRepository;
    private userTokensRepository: IUserTokensRepository;
    private hashProvider: IHashProvider;

    
    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        userTokensRepository: IUserTokensRepository,
        @inject('HashProvider')
        hashProvider: IHashProvider
    ){
        this.usersRepository = usersRepository;
        this.userTokensRepository = userTokensRepository;        
        this.hashProvider = hashProvider;        

    }

    public async execute({token, password, password_confirmation}:RequestDTO) : Promise<void>{

        const userToken = await this.userTokensRepository.findByToken(token);

        if(!userToken){
            throw new AppError('Token inválido', 401);
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if(!user){
            throw new AppError('Usuário não encontrado inválido', 401);
        }

        if(password!== password_confirmation){
            throw new AppError('Senhas não batem', 400);
        }

        const currentHour = Date.now();

        if(isAfter(currentHour, addHours(userToken.created_at, 2))){
            throw new AppError('Token expirado', 401);
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
        
    }
}

export default ResetPasswordService;
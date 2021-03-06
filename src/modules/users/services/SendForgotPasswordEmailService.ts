import {inject, injectable} from 'tsyringe';
import path from 'path';
import IMailProvider from '../../../shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface RequestDTO{
    email: string,
}

@injectable()
class SendForgotPasswordEmailService{

    private usersRepository: IUsersRepository;
    private mailProvider: IMailProvider;
    private userTokensRepository: IUserTokensRepository;
    
    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository,
        @inject('MailProvider')
        mailProvider: IMailProvider,
        @inject('UserTokensRepository')
        userTokensRepository: IUserTokensRepository
    ){
        this.usersRepository = usersRepository;
        this.mailProvider = mailProvider;   
        this.userTokensRepository = userTokensRepository;        

    }

    public async execute(email: string) : Promise<void>{

        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new AppError('E-mail do usuário não cadastrado', 400);
        }

        const {token} = await this.userTokensRepository.generate(user.id);

        const forgotPasswordFile = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');
        
        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: forgotPasswordFile,
                variables:{
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`
                }
            }
        });
        
    }
}

export default SendForgotPasswordEmailService;
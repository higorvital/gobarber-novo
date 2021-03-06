import User from '../models/User';
import { Repository, getRepository, Not } from 'typeorm';
import IUsersRepository from '../../../repositories/IUsersRepository';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';


class UsersRepository implements IUsersRepository{

    private ormRepository: Repository<User>;

    constructor(){
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {

        const user = await this.ormRepository.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {

        const user = await this.ormRepository.findOne({
            where: {
                email
            }
        });

        return user;
    }

    public async create({name, email, password}: ICreateUserDTO): Promise<User>{

        const user = this.ormRepository.create({name, email, password});
    
        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User>{

        await this.ormRepository.save(user);

        return user;
    }

    public async findAllProviders({exceptd_user_id}: IListProvidersDTO){

        let users = []

        if(exceptd_user_id){
            users = await this.ormRepository.find({
                where: {
                    id: Not(exceptd_user_id)
                }
            });
        }else{
            users = await this.ormRepository.find();
        }

        return users;
    }

}

export default UsersRepository;
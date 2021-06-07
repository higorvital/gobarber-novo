import User from '../../infra/typeorm/models/User';
import IUsersRepository from '../IUsersRepository';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';


class FakeUsersRepository implements IUsersRepository{

    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {

        const userById = this.users.find(user=>user.id === id);

        return userById;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const userByEmail = this.users.find(user=>user.email === email);

        return userByEmail;
    }

    public async create(userData: ICreateUserDTO): Promise<User>{

        const newUser = new User();

        Object.assign(newUser, {id: uuid(), ...userData})

        this.users.push(newUser);

        return newUser;
    }

    public async save(user: User): Promise<User>{
        const userIndex = this.users.findIndex(usr => usr.id === user.id);

        this.users[userIndex] = user;

        return user;
    }

    public async findAllProviders({exceptd_user_id}: IListProvidersDTO){

        let users = this.users;
        
        if(exceptd_user_id){
           users = users.filter(user=>user.id !== exceptd_user_id);
        }

        return users;
    }

}

export default FakeUsersRepository;
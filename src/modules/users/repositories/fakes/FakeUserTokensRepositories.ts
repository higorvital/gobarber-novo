import User from '../../infra/typeorm/models/User';
import IUsersRepository from '../IUsersRepository';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IUserTokensRepository from '../IUserTokensRepository';
import UserToken from '../../infra/typeorm/models/UserToken';


class FakeUserTokensRepository implements IUserTokensRepository{

    private userTokens: UserToken[] = [];

    public async generate(user_id: string){
        const userToken = new UserToken();
        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            user_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        this.userTokens.push(userToken);

        return userToken;
    }

    public async findByToken(token: string){
        const userToken = this.userTokens.find(t => t.token === token);

        return userToken;
    }


}

export default FakeUserTokensRepository;
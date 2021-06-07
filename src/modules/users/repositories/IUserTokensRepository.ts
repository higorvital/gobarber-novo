import UserToken from "../infra/typeorm/models/UserToken";

interface IUserTokensRepository {
    findByToken(token: string): Promise<UserToken | undefined>;
    generate(user_id: string): Promise<UserToken>;
}

export default IUserTokensRepository;
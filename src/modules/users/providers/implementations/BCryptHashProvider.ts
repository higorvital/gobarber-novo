import {compare, hash} from 'bcryptjs';
import IHashProvider from "../IHashProvider";

class BCryptHashProvider implements IHashProvider{
    async generateHash(payload: string){
        return await hash(payload, 8);
    }
    
    async compareHash(payload: string, hashed: string){
        return await compare(payload, hashed); 
    }
}

export default BCryptHashProvider;
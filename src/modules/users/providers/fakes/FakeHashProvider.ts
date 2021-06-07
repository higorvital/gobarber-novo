import IHashProvider from "../IHashProvider";

class FakeHashProvider implements IHashProvider{
    async generateHash(payload: string){
        return payload;
    }

    async compareHash(payload: string, hashed: string){
        return payload === hashed;
    }
}

export default FakeHashProvider;
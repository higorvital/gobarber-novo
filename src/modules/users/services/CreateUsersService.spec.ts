import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepositories";
import CreateUsersService from "./CreateUsersService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUsersService: CreateUsersService;

describe('CreateAppointmens', ()=>{

    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        
        createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);

    })

    it('should be able to create users', async ()=>{

        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
    })

    it('should not be able to create user with another user email', async ()=>{

        await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        await expect(
            createUsersService.execute({
                name: 'Teste',
                email: 'teste@teste.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

})
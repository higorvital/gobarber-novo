import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";
import FakeNotificationsRepository from "../../notifications/fakes/FakeNotificationsRepository";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepositories";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUsersService from "./CreateUsersService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUsersService;
let athenticateUsersService: AuthenticateUserService;

let fakeNotificationsRepository: FakeNotificationsRepository;;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', ()=>{
    
    beforeEach(()=>{

        fakeCacheProvider = new FakeCacheProvider();
        fakeNotificationsRepository = new FakeNotificationsRepository();

        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUsersService = new CreateUsersService(fakeUsersRepository,fakeHashProvider, fakeCacheProvider);
        athenticateUsersService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    });

    it('should be able to authenticate users', async ()=>{

        await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });
        
        const user = await athenticateUsersService.execute({
            email: 'teste@teste.com',
            password: '123456'
        });

        expect(user).toHaveProperty('token');
    });

    it('should not be able to authenticate users with email that doesnt exist', async ()=>{
        
        await expect(
            athenticateUsersService.execute({
                email: 'teste@teste.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate users with wrong combination of email and password', async ()=>{
    
        await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });
        
        await expect(
            athenticateUsersService.execute({
                email: 'teste@teste.com',
                password: '1234567'
            })
        ).rejects.toBeInstanceOf(AppError);

    });

});
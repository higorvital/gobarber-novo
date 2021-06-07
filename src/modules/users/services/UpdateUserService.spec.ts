import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepositories";
import CreateUsersService from "./CreateUsersService";
import UpdateUserService from "./UpdateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let fakeCacheProvider: FakeCacheProvider;

let createUsersService: CreateUsersService;
let updateUserService: UpdateUserService;

describe('UpdateUser', ()=>{

    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        fakeCacheProvider = new FakeCacheProvider();

        createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
        updateUserService = new UpdateUserService(fakeUsersRepository, fakeHashProvider);

    })

    it('should be able to update user', async ()=>{
        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        await updateUserService.execute({
            user_id: user.id,
            name: 'Teste2',
            email: 'teste2@teste.com',
            old_password: '123456',
            password: '123123',
        });

        expect(user.name).toBe('Teste2');
        expect(user.email).toBe('teste2@teste.com');
        expect(user.password).toBe('123123');

    });

    it('should not be able to update to non-existeing user', async ()=>{

        await expect(updateUserService.execute({
            user_id: 'non-existing id',
            name: 'Teste2',
            email: 'teste2@teste.com',
            old_password: '123456',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);


    });

    it('should not be able to update to another users email', async ()=>{
        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        await createUsersService.execute({
            name: 'Teste2',
            email: 'teste2@teste.com',
            password: '123456'
        });

        await expect(updateUserService.execute({
            user_id: user.id,
            name: 'Teste2',
            email: 'teste2@teste.com',
            old_password: '123456',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);


    });

    it('should not be able to update with password without informig old one', async ()=>{
        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });


        await expect(updateUserService.execute({
            user_id: user.id,
            name: 'Teste2',
            email: 'teste2@teste.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);


    });

    it('should not be able to update with password with incorrect old password', async ()=>{
        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });


        await expect(updateUserService.execute({
            user_id: user.id,
            name: 'Teste2',
            email: 'teste2@teste.com',
            old_password: 'wrong old password',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);


    });

});
import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepositories";
import CreateUsersService from "./CreateUsersService";
import ShowUserService from "./ShowUserService";
import UpdateUserService from "./UpdateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let fakeCacheProvider: FakeCacheProvider;

let createUsersService: CreateUsersService;
let showUserService: ShowUserService;

describe('ShowUserService', ()=>{

    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
        showUserService = new ShowUserService(fakeUsersRepository);

    })

    it('should be able to show user', async ()=>{
        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        const userShow = await showUserService.execute(user.id);

        expect(userShow.name).toBe('Teste');
        expect(userShow.email).toBe('teste@teste.com');

    });

    it('should not be able to show non-existeing user', async ()=>{
        await expect(
            showUserService.execute('user.id')
  
        ).rejects.toBeInstanceOf(AppError); 
    
    });

});
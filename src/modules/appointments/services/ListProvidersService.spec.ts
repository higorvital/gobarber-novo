import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import FakeNotificationsRepository from "../../notifications/fakes/FakeNotificationsRepository";
import FakeHashProvider from "../../users/providers/fakes/FakeHashProvider";
import FakeUsersRepository from "../../users/repositories/fakes/FakeUsersRepositories";
import CreateUsersService from "../../users/services/CreateUsersService";
import ListProvidersService from "./ListProvidersService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUsersService: CreateUsersService;
let listProvidersService: ListProvidersService;

let fakeCacheProvider: FakeCacheProvider;


describe('ShowUserService', ()=>{

    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        fakeCacheProvider = new FakeCacheProvider();

        createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
        listProvidersService = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);

    })

    it('should be able to show providers', async ()=>{
        const user1 = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        const user2 = await createUsersService.execute({
            name: 'Teste2',
            email: 'teste2@teste.com',
            password: '123456'
        });

        const userLogged = await createUsersService.execute({
            name: 'Teste3',
            email: 'teste3@teste.com',
            password: '123456'
        });

        const users = await listProvidersService.execute(userLogged.id);

        expect(users).toEqual([user1,user2]);


    });

});
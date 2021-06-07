import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import FakeMailProvider from "../../../shared/container/providers/MailProvider/fakes/FakeMailProvider";
import AppError from "../../../shared/errors/AppError";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepositories";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepositories";
import CreateUsersService from "./CreateUsersService";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;


let createUsersService: CreateUsersService;
let sendForgotMailService: SendForgotPasswordEmailService;

let fakeCacheProvider: FakeCacheProvider;


describe('SendForgotPasswordMail', ()=>{

    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        fakeCacheProvider = new FakeCacheProvider();

        createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider,fakeCacheProvider);
        sendForgotMailService = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);

    })

    it('should be able to send forgot password mail', async ()=>{
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        await sendForgotMailService.execute(user.email);

        expect(sendMail).toBeCalled();

    });

    it('should not be able to send forgot password mail with non existing user', async ()=>{

        await expect(
            sendForgotMailService.execute('teste@teste.com')
        ).rejects.toBeInstanceOf(AppError);

    });

    it('should be able to generate forgot password token', async ()=>{
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        await sendForgotMailService.execute(user.email);

        expect(generateToken).toBeCalledWith(user.id);

    });

});
import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";
import FakeNotificationsRepository from "../../notifications/fakes/FakeNotificationsRepository";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepositories";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepositories";
import CreateUsersService from "./CreateUsersService";
import ResetPasswordService from "./ResetPasswordService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;


let createUsersService: CreateUsersService;
let resetPasswordService: ResetPasswordService;

let fakeCacheProvider: FakeCacheProvider;


describe('ResetPassowrd', ()=>{

    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        fakeCacheProvider = new FakeCacheProvider();

        createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
        resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);

    })

    it('should be able to reset password', async ()=>{

        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const {token} = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({token, password: '123123'});

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(user.password).toBe('123123');
    });

    it('should not be able to reset password with non-existing token', async ()=>{

        await expect(
            resetPasswordService.execute({token: 'sdfdsfdsf', password: '123123'})
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with non-existing user', async ()=>{

        const {token} = await fakeUserTokensRepository.generate('user.id');

        await expect(
            resetPasswordService.execute({token, password: '123123'})
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password after 2 hours of the token being generated', async ()=>{

        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });


        const {token} = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({token, password: '123123'})
        ).rejects.toBeInstanceOf(AppError);
    });

});
import AppError from "../../../shared/errors/AppError";
import FakeHashProvider from "../providers/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepositories";
import CreateUsersService from "./CreateUsersService";
import UploadAvatarService from "./UploadAvatarService";
import FakeStorageProvider from '../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;

let fakeCacheProvider: FakeCacheProvider;

let createUsersService: CreateUsersService;
let uploadAvatarsService: UploadAvatarService;

describe('UpdateAvatar', ()=>{

    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeStorageProvider = new FakeStorageProvider();

        fakeCacheProvider = new FakeCacheProvider();

        createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
        uploadAvatarsService = new UploadAvatarService(fakeUsersRepository, fakeStorageProvider);

    })

    it('should be able to update avatar', async ()=>{

        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        await uploadAvatarsService.execute({
            user_id: user.id,
            filename: 'teste.jpg'
        });

        expect(user.avatar).toBe('teste.jpg');
    })

    it('should not be able to update avatar if user does not exist', async ()=>{

        await expect(
            uploadAvatarsService.execute({
                user_id: 'non-existent user',
                filename: 'teste.jpg'
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should be able to update avatar', async ()=>{

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await createUsersService.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '123456'
        });

        await uploadAvatarsService.execute({
            user_id: user.id,
            filename: 'teste.jpg'
        });

        await uploadAvatarsService.execute({
            user_id: user.id,
            filename: 'teste2.jpg'
        });

        expect(deleteFile).toHaveBeenCalledWith('teste.jpg');

        expect(user.avatar).toBe('teste2.jpg');
    })

});
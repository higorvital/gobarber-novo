import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";
import FakeNotificationsRepository from "../../notifications/fakes/FakeNotificationsRepository";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository"
import CreateAppointmentsService from "./CreateAppointmentsService";


let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentsService;
let fakeNotificationsReposittory: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointmens', ()=>{

    beforeEach(()=>{
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsReposittory = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointmentService = new CreateAppointmentsService(fakeAppointmentsRepository,fakeNotificationsReposittory , fakeCacheProvider);

    })

    it('should be able to create appointments', async ()=>{

        const date = new Date(2021, 4, 10, 11);

        const appointment = await createAppointmentService.execute({
            date,
            provider_id: '1212122121',
            user_id: 'user'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1212122121');
    })

    it('should not be able to create appointments on the same hour', async ()=>{

        const date = new Date(2021, 4, 10, 11);
        await createAppointmentService.execute({
            date,
            provider_id: '1212122121',
            user_id: 'user'

        });
        

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: '2212122121',
                user_id: 'user'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to create appointments with yourself', async ()=>{

        const date = new Date(2021, 4, 10, 11);
        

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: '2212122121',
                user_id: '2212122121'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to create appointments with past date', async ()=>{

        const date = new Date(2020, 4, 10, 11);

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: 'provider-id',
                user_id: 'user-id'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to create appointments before 8am and after 5pm', async ()=>{

        const date = new Date(2021, 4, 10, 5);

        await expect(
            createAppointmentService.execute({
                date,
                provider_id: 'provider-id',
                user_id: 'user-id'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

})
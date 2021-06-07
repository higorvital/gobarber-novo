import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";
import FakeNotificationsRepository from "../../notifications/fakes/FakeNotificationsRepository";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository"
import CreateAppointmentsService from "./CreateAppointmentsService";
import ListProvidersMonthAvailabilityService from './ListProvidersMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentsService;
let listProvidersMonthAvailabilty: ListProvidersMonthAvailabilityService;
let fakeNotificationsRepository: FakeNotificationsRepository;;
let fakeCacheProvider: FakeCacheProvider;


describe('ListProvidersMonthAvailability', ()=>{

    beforeEach(()=>{
        fakeCacheProvider = new FakeCacheProvider();
        fakeNotificationsRepository = new FakeNotificationsRepository();

        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentsService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
        listProvidersMonthAvailabilty = new ListProvidersMonthAvailabilityService(fakeAppointmentsRepository);
    })

    it('should be able to list available days in month', async ()=>{

        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 8, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 9, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 10, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 11, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 12, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 13, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 14, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 15, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 16, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 17, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });
        await createAppointmentService.execute({
            date: new Date(2021, 10, 2, 8, 0, 0),
            provider_id: '1212122121',
            user_id: 'user'
        });

        const availabity = await listProvidersMonthAvailabilty.execute({provider_id: '1212122121', year: 2021, month: 11})

        expect(availabity).toEqual(
            expect.arrayContaining([
                {day: 1, available: false},
                {day: 2, available: true},
                {day: 3, available: true},

            ])
        )

    })

})
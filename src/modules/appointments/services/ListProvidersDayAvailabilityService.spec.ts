import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "../../../shared/errors/AppError";
import FakeNotificationsRepository from "../../notifications/fakes/FakeNotificationsRepository";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository"
import CreateAppointmentsService from "./CreateAppointmentsService";
import ListProvidersDayAvailabilityService from './ListProvidersDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentsService;
let listProvidersDayAvailabilty: ListProvidersDayAvailabilityService;

let fakeNotificationsRepository: FakeNotificationsRepository;;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersMonthAvailability', ()=>{

    beforeEach(()=>{

        fakeCacheProvider = new FakeCacheProvider();
        fakeNotificationsRepository = new FakeNotificationsRepository();

        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentsService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
        listProvidersDayAvailabilty = new ListProvidersDayAvailabilityService(fakeAppointmentsRepository);
    })

    it('should be able to list available hours in day', async ()=>{

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

        jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
            return new Date(2021, 10, 1, 11).getTime();
        })

        const availabity = await listProvidersDayAvailabilty.execute({provider_id: '1212122121', year: 2021, month: 11, day: 1})

        expect(availabity).toEqual(
            expect.arrayContaining([
                {hour: 9, available: false},
                {hour: 10, available: false},
                {hour: 12, available: true},
                {hour: 13, available: false},
                {hour: 14, available: false},
                {hour: 15, available: true},

            ])
        )

    })

})
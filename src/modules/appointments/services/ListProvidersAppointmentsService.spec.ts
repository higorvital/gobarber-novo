import AppError from "../../../shared/errors/AppError";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository"
import CreateAppointmentsService from "./CreateAppointmentsService";
import ListProvidersAppointmentsService from "./ListProviderAppointmentsService";
import FakeNotificationsRepository from '../../notifications/fakes/FakeNotificationsRepository';
import FakeCacheProvider from "../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

let createAppointmentService: CreateAppointmentsService;
let listProviderAppointmentsAvailabilty: ListProvidersAppointmentsService;
let fakeNotificationsRepository: FakeNotificationsRepository;;


describe('ListProvidersMonthAvailability', ()=>{

    beforeEach(()=>{

        fakeCacheProvider = new FakeCacheProvider();

        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        createAppointmentService = new CreateAppointmentsService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
        listProviderAppointmentsAvailabilty = new ListProvidersAppointmentsService(fakeAppointmentsRepository, fakeCacheProvider);
    })

    it('should be able to list provider appointments ina a day', async ()=>{

        const appointment1 = await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 13, 0, 0),
            provider_id: '1212122121',
                user_id: 'user'
        });
        const appointment2 = await createAppointmentService.execute({
            date: new Date(2021, 10, 1, 14, 0, 0),
            provider_id: '1212122121',
                user_id: 'user'
        });


        const appointments = await listProviderAppointmentsAvailabilty.execute({provider_id: '1212122121', year: 2021, month: 11, day: 1})

        expect(appointments).toEqual(
            [
                appointment1,
                appointment2
            ]
        )

    })

})
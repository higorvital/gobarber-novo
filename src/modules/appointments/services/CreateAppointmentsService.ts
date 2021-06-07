import {format, getHours, isBefore, startOfHour} from 'date-fns';
import {inject, injectable} from 'tsyringe';
import Appointment from '../infra/typeorm/models/Appointment';
import AppError from '../../../shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '../../notifications/repositories/INotificationsRepository';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';


interface RequestDTO{
    provider_id: string;
    date: Date;
    user_id: string;
}

@injectable()
class CreateAppointmentsService{

    private appointmentsRepository: IAppointmentsRepository;
    private notificationsRepository: INotificationsRepository;
    private cacheProvider: ICacheProvider;

    constructor(
        @inject('AppointmentsRepository')
        appointmentsRepository: IAppointmentsRepository,
        @inject('NotificationsRepository')
        notificationsRepository: INotificationsRepository,
        @inject('CacheProvider')
        cacheProvider: ICacheProvider){
        this.appointmentsRepository = appointmentsRepository;
        this.notificationsRepository = notificationsRepository;
        this.cacheProvider = cacheProvider;

    }

    public async execute({provider_id, date, user_id}:RequestDTO) : Promise<Appointment>{

        if(provider_id === user_id){
            throw new AppError("Você não pode criar um assinatua consigo mesmo");
        }

        const appointmentDate = startOfHour(date);

        if(isBefore(appointmentDate, Date.now())){
            throw new AppError("Você não pode criar um agendamento em um horário que já passou");
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17){
            throw new AppError("Você só pode criar uma assinatua entre 8 e 17 horas");
        }
        
        const findAppointmentByDate = await this.appointmentsRepository.findByDate(appointmentDate, provider_id)

        if(findAppointmentByDate){
            throw new AppError("Data indisponível", 401);
        }

        const appointment = await this.appointmentsRepository.create({provider_id, date: appointmentDate, user_id});
        
        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

        await this.notificationsRepository.create({
            content: `Novo agendamento pra dia ${dateFormatted}`,
            recipient_id: provider_id
        })

        await this.cacheProvider.invalidate(`provider-appointments:${format(date, 'yyyy-M-d')}`)

        return appointment;
        
    }
}

export default CreateAppointmentsService;
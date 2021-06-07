import Appointment from '../models/Appointment';
import { Repository, getRepository, Raw } from 'typeorm';
import IAppointmentsRepository from '../../../repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '../../../dtos/ICreateAppointmentsDTO';
import IFindInMonthByProviderDTO from '../../../dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDayByProviderDTO from '../../../dtos/IFindAllInDayByProviderDTO';


class AppointmentsRepository implements IAppointmentsRepository{

    private ormRepository: Repository<Appointment>;

    constructor(){
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {

        const appointmentInSameDate = await this.ormRepository.findOne({
            where: {date, provider_id}
        })

        return appointmentInSameDate;
    }

    public async create({date, provider_id, user_id}: ICreateAppointmentsDTO): Promise<Appointment>{

        const appointment = this.ormRepository.create({provider_id, date, user_id});

        await this.ormRepository.save(appointment);

        return appointment;
    }
    
    public async findAllinMonthByProvider({provider_id, year, month}: IFindInMonthByProviderDTO){

        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName =>
                    `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`),
            },
            relations: ['user']
        });

        return appointments;

    }

    public async findAllinDayByProvider({provider_id, year, month, day}: IFindAllInDayByProviderDTO){

        const parsedMonth = String(month).padStart(2, '0');
        const parsedDay = String(day).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName =>
                    `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`),
            },
            relations: ['user']
        });

        return appointments;

    }

}

export default AppointmentsRepository;
import {getDate, getMonth, getYear, isEqual} from 'date-fns';
import {uuid} from 'uuidv4';
import Appointment from '../../infra/typeorm/models/Appointment';
import IAppointmentsRepository from '../IAppointmentsRepository';
import ICreateAppointmentsDTO from '../../dtos/ICreateAppointmentsDTO';
import IFindInMonthByProviderDTO from '../../dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDayByProviderDTO from '../../dtos/IFindAllInDayByProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository{

    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {

        const appointmentInSameDate = this.appointments.find(appointment => isEqual(appointment.date, date));

        return appointmentInSameDate;
    }

    public async create({date, provider_id, user_id}: ICreateAppointmentsDTO): Promise<Appointment>{

        const appointment = new Appointment();

        Object.assign(appointment, {id: uuid() ,date, provider_id, user_id});

        this.appointments.push(appointment);

        return appointment;
    }

    public async findAllinMonthByProvider({provider_id, year, month}: IFindInMonthByProviderDTO){

        const appointments = this.appointments.filter(appointment=> (
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
        ));

        return appointments;
    }


    public async findAllinDayByProvider({provider_id, year, month, day}: IFindAllInDayByProviderDTO){

        const appointments = this.appointments.filter(appointment=> (
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year &&
            getDate(appointment.date) === day
        ));

        return appointments;
    }

}

export default FakeAppointmentsRepository;
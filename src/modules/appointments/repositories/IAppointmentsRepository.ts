import Appointment from "../infra/typeorm/models/Appointment";
import ICreateAppointmentsDTO from "../dtos/ICreateAppointmentsDTO";
import IFindInMonthByProviderDTO from "../dtos/IFindAllInMonthByProviderDTO";
import IFindAllInDayByProviderDTO from "../dtos/IFindAllInDayByProviderDTO";

interface IAppointmentsRepository{
    findByDate(date: Date, provider_id: string): Promise<Appointment | undefined >;
    create(data: ICreateAppointmentsDTO): Promise<Appointment>;
    findAllinMonthByProvider(data: IFindInMonthByProviderDTO): Promise<Appointment[]>;
    findAllinDayByProvider(data: IFindAllInDayByProviderDTO): Promise<Appointment[]>;

}

export default IAppointmentsRepository;
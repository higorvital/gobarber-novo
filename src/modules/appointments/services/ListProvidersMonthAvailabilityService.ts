import { getDate, getDaysInMonth, isAfter } from "date-fns";
import { inject, injectable } from "tsyringe";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface RequestDTO{
    provider_id: string;
    year: number;
    month: number;
}

interface ResponseDTO{
    day: number;
    available: boolean;
}

@injectable()
class ListProvidersMonthAvailabilityService{

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ){

    }

    public async execute({provider_id, month, year}:RequestDTO): Promise<ResponseDTO[]>{
        
        const appointments = await this.appointmentsRepository.findAllinMonthByProvider({
            provider_id,
            year,
            month
        });

        const numbersOfDaysinMont = getDaysInMonth(new Date(year, month - 1));

        const eachDayArray = Array.from({
                length: numbersOfDaysinMont,
            },
            (__, index)=> index + 1
        );      
        const availability  = eachDayArray.map(day=>{

            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => getDate(appointment.date) === day)

            return {
                day,
                available: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10
            }

        });

        return availability;

    }
}

export default ListProvidersMonthAvailabilityService;
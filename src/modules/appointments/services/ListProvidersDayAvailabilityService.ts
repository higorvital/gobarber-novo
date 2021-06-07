import { getHours, isAfter } from "date-fns";
import { inject, injectable } from "tsyringe";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface RequestDTO{
    provider_id: string;
    year: number;
    month: number;
    day: number;
}

interface ResponseDTO{
    hour: number;
    available: boolean;
}

@injectable()
class ListProvidersDayAvailabilityService{

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ){

    }

    public async execute({provider_id, month, year, day}:RequestDTO): Promise<ResponseDTO[]>{
        
        const appointments = await this.appointmentsRepository.findAllinDayByProvider({
            provider_id,
            year,
            month,
            day
        });
        
        const numbersOfHoursInDay = 10;
        const startHour = 8;
        
        const eachHourArray = Array.from({
            length: numbersOfHoursInDay,
        },
        (__, index)=> index + startHour
        );

        const currentTime = new Date(Date.now());
        
        const availability  = eachHourArray.map(hour=>{
            const appointmentsInHour = appointments.find(appointment => getHours(appointment.date) === hour)
            
            const parsedHour = new Date(year, month - 1, day, hour);

            return {
                hour,
                available: !appointmentsInHour && isAfter(parsedHour, currentTime)
            }
            
        });
        
        return availability;

    }
}

export default ListProvidersDayAvailabilityService;
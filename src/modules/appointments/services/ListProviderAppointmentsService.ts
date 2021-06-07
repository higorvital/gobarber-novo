import { classToClass } from "class-transformer";
import { getHours, isAfter } from "date-fns";
import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../shared/container/providers/CacheProvider/models/ICacheProvider";
import Appointment from "../infra/typeorm/models/Appointment";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface RequestDTO{
    provider_id: string;
    year: number;
    month: number;
    day: number;
}

@injectable()
class ListProvidersAppointmentsService{

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider

    ){

    }

    public async execute({provider_id, month, year, day}:RequestDTO): Promise<Appointment[]>{
        
        const cacheKey = `provider-appointments:${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey);

        // let appointments;

        if(!appointments){

            appointments = await this.appointmentsRepository.findAllinDayByProvider({
                provider_id,
                year,
                month,
                day
            });

            await this.cacheProvider.save(cacheKey, classToClass(appointments));

        }


        return appointments;
        
    }
}

export default ListProvidersAppointmentsService;
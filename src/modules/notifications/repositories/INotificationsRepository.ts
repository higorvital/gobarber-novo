import ICreateNotification from "../dtos/ICreateNotification";
import Notification from '../infra/typeorm/schemas/Notification';

interface INotificationsRepository{
    create(data: ICreateNotification): Promise<Notification>;
}

export default INotificationsRepository;
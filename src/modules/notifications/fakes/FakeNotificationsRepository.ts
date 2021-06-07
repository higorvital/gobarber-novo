import { ObjectID } from "typeorm";
import { uuid } from "uuidv4";
import ICreateNotification from "../dtos/ICreateNotification";
import Notification from "../infra/typeorm/schemas/Notification";
import INotificationsRepository from "../repositories/INotificationsRepository";


class FakeNotificationsRepository implements INotificationsRepository{

    private notifications: Notification[] = [];


    public async create({content, recipient_id}: ICreateNotification){
        
        const notification = new Notification();

        //Tava new ObjectID()
        Object.assign(notification, {
            id: uuid(),
            content,
            recipient_id
        });

        this.notifications.push(notification)

        return notification;

    }
}

export default FakeNotificationsRepository;
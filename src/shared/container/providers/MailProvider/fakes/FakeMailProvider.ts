import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailProvider from "../models/IMailProvider";


class FakeMailProvider implements IMailProvider{

    private mails: ISendMailDTO[] = []

    public async sendMail(message: ISendMailDTO){
        this.mails.push(message);
    }
}

export default FakeMailProvider;
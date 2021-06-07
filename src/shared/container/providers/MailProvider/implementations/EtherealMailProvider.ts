import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from "../models/IMailProvider";

@injectable()
class EtherealMailProvider implements IMailProvider{
    private client: Transporter;
    private mailTemplateProvider: IMailTemplateProvider;

    constructor(
        @inject('MailTemplateProvider')
        mailTemplateProvider: IMailTemplateProvider
    ){
        this.mailTemplateProvider = mailTemplateProvider;

        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        })
    }

    public async sendMail({to, from, subject, templateData}: ISendMailDTO){
        const mail = await this.client.sendMail({
            to: {
                name: to.name,
                address: to.email
            },
            from: {
                name: from?.name || 'Equipe GoBarber' ,
                address: from?.email || 'equipe@gobarber.com.br'
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData)
        });

        console.log(mail.messageId);
        console.log('Preview url: %s', nodemailer.getTestMessageUrl(mail));

    }
}

export default EtherealMailProvider;
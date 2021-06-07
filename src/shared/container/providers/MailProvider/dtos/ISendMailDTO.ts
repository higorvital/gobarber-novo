import IParseMailTemplateDTO from "../../MailTemplateProvider/dtos/IParseMailTemplateDTO";

interface IMailContactDTO{
    name: string;
    email: string;
}

interface ISendMailDTO{

    to: IMailContactDTO;
    from?: IMailContactDTO;
    subject: string;
    templateData: IParseMailTemplateDTO;

}

export default ISendMailDTO;
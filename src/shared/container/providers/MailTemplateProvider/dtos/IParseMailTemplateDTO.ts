interface VariablesDTO{
    [key: string]: string | number;
}

interface IParseMailTemplateDTO{
    file: string;
    variables: VariablesDTO;
}

export default IParseMailTemplateDTO;
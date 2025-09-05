import { MessageVariablesFactory } from "../factories/message-variables.factory";
import { RequestBody } from "../types/request-body";

export class MessageBuilderService {
    private messageVariablesFactory: MessageVariablesFactory;

    constructor() {
        this.messageVariablesFactory = new MessageVariablesFactory();
    }

    public getMessage(requestBody: RequestBody): string {
        const messageVariables = this.messageVariablesFactory.createMessageVariables(requestBody);
        const message = 
            `
                        *PROPOSTA DE TRABALHO PARA ${messageVariables.jobComplement} EM ${messageVariables.city.split(",").at(0)}:*
            🔸Local: ${messageVariables.city}}.
            🔸Função: ${messageVariables.jobComplement}.
            🔸Salário base de R$ ${messageVariables.baseSalary}.
            🔸Modalidade ${messageVariables.modality}.

            *Oferecemos:*

            ➡ Seguro de vida.
            ➡ Fornecemos almoço no local de segunda a sexta-feira e café da manhã de segunda a sábado.
            ➡ Auxílio Transporte, considerando o valor de R$ ${messageVariables.vr} por dia útil trabalhado.
            ➡ Convênio BR5 assim que finalizado a admissão.

            *Adicionais:*
            ${messageVariables.extraBenefitsList}
            
            Horário de trabalho:
            ${messageVariables.workingHours}

            Proposta de trabalho válida por 15 dias após envio.
            `
            return message;
    }
}
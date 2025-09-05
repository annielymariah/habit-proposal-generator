import { MessageVariables } from "../models/entities/message-variables.entity";
import { BenefitEnum } from "../models/enums/benefit.enum";
import { CityEnum } from "../models/enums/city.enum";
import { ContractTypeEnum } from "../models/enums/contract-type.enum";
import { JobComplementEnum } from "../models/enums/job-complement.enum";
import { WorkingHoursEnum } from "../models/enums/working-hours.enum";
import { RequestBody } from "../types/request-body";

export class MessageVariablesFactory {
    private salaryMap: Map<JobComplementEnum, string>;

    constructor () {
        this.salaryMap = this.initializeSalaryMap();
    }

    private initializeSalaryMap(): Map<JobComplementEnum, string> {
        const newSalaryMap = new Map<JobComplementEnum, string>();

        newSalaryMap.set(JobComplementEnum.PEDREIRO, "VALOR SALARIO PEDREIRO");
        newSalaryMap.set(JobComplementEnum.ALMOXARIFE, "2389");
        newSalaryMap.set(JobComplementEnum.AUXILIAR_ALMOXARIFADO, "1925");
        newSalaryMap.set(JobComplementEnum.APONTADOR, "1925");
        newSalaryMap.set(JobComplementEnum.ELETRICISTA, "2469");
        newSalaryMap.set(JobComplementEnum.ENCANADOR, "2469");
        newSalaryMap.set(JobComplementEnum.VIGIA, "1779");

        newSalaryMap.set(JobComplementEnum.MOTOBOY_I, "2389");
        newSalaryMap.set(JobComplementEnum.MOTOBOY_II, "2389");
        newSalaryMap.set(JobComplementEnum.MOTOBOY_III, "2389");

        newSalaryMap.set(JobComplementEnum.OPERADOR_TRATOR_I, "1925");
        newSalaryMap.set(JobComplementEnum.OPERADOR_TRATOR_II, "2389");
        newSalaryMap.set(JobComplementEnum.OPERADOR_TRATOR_III, "2389");
        
        newSalaryMap.set(JobComplementEnum.ASSISTENTE_ADMIN_JUNIOR, "2000");
        newSalaryMap.set(JobComplementEnum.ASSISTENTE_ADMIN_PLENO, "2500");
        newSalaryMap.set(JobComplementEnum.ASSISTENTE_ADMIN_SENIOR, "2500");

        newSalaryMap.set(JobComplementEnum.DESENVOLVEDOR_JUNIOR, "1518");
        newSalaryMap.set(JobComplementEnum.DESENVOLVEDOR_PLENO, "2000");
        newSalaryMap.set(JobComplementEnum.DESENVOLVEDOR_SENIOR, "2500");

        newSalaryMap.set(JobComplementEnum.ENCARREGADO, "3195");
        newSalaryMap.set(JobComplementEnum.MEIO_OFICIAL, "1925");
        newSalaryMap.set(JobComplementEnum.AUXILIAR, "1925");
        newSalaryMap.set(JobComplementEnum.AJUDANTE, "1779");
        newSalaryMap.set(JobComplementEnum.PROFISSIONAL, "2389");

        return newSalaryMap;
    }

    private getModality(requestBody: RequestBody): "presential" | "homeoffice" {
        return requestBody.modality;
    }

    private getJobComplement(requestBody: RequestBody): JobComplementEnum {
        return requestBody.job;
    }

    private getCity(requestBody: RequestBody): CityEnum {
        return requestBody.city;
    }

    private getBaseSalary(requestBody: RequestBody): string | undefined {
        const job = requestBody.job.split(" ").at(0);
        if(job == JobComplementEnum.AJUDANTE || job == JobComplementEnum.AUXILIAR || job == JobComplementEnum.MEIO_OFICIAL || job == JobComplementEnum.ENCARREGADO || job == JobComplementEnum.PROFISSIONAL){
            return this.salaryMap.get(job as JobComplementEnum);
        }
        return this.salaryMap.get(requestBody.job);
    }

    private getVr(requestBody: RequestBody): string | null {
        if(requestBody.city == CityEnum.SORRISO) {
            return null;
        }
        if(requestBody.city == CityEnum.CUIABA) {
            return "16";
        }
        return "20";
    }

    private getAssuity(requestBody: RequestBody): string | null {
        const job = this.getSector(requestBody.job);
        console.log(job);
        if(job == JobComplementEnum.AJUDANTE || job == "Assistente") {
            return "395";
        }
        if(job == JobComplementEnum.PROFISSIONAL) {
            return "250"
        }
        return null;
    }

    private getContractType(requestBody: RequestBody): ContractTypeEnum {
        return requestBody.contractType;
    }

    private getSector(job: string): string {
        const jobSplit = job.split(" ");
        return jobSplit.at(jobSplit.length - 1);
    }

    private getExtraBenefits(requestBody: RequestBody): string {
        
        console.log(requestBody.job)

        let benefitArray = [];
        benefitArray.push("\t");
    
        const jobSector = this.getSector(requestBody.job);
        
        let isAdmin: boolean;
        
        try {
            if(requestBody.job.split(" ").at(2) == "Administrativo" || requestBody.job.split(" ").at(1) == "Administrativo") {
                isAdmin = true;
            }  else {
                isAdmin = false;
            }
        } catch(error) {
                isAdmin = false;
        }

        if(jobSector == JobComplementEnum.ELETRICISTA) {
            benefitArray.push(BenefitEnum.PERICULOSIDADE);
        }

        if(jobSector == JobComplementEnum.ENCANADOR) {
            benefitArray.push(BenefitEnum.PERICULOSIDADE);
        }

        if(jobSector == JobComplementEnum.ENCANADOR) {
            benefitArray.push(BenefitEnum.INSALIBRIDADE);
        }

        if(isAdmin) {
            benefitArray.push(BenefitEnum.PREMIO_PASSAGEM_AEREA)
        } else {
            benefitArray.push(BenefitEnum.PREMIOS_POR_ATIVIDADES_EXEPCIONAIS);
        }

        if(requestBody.modality == "homeoffice") {
            benefitArray.push("VAI BOTAR AINDA");
        }

        if(jobSector == "Serralheiro") {
            benefitArray.push(BenefitEnum.CHECK_LIST);
        }

        if(jobSector == "Assistente" || jobSector == "Ajudante" || requestBody.job == JobComplementEnum.PEDREIRO) {
            const assuity = this.getAssuity(requestBody);
            if(assuity) {
                benefitArray.push("R$ " + assuity + BenefitEnum.ASSUIDADE);
            }
        }

        

        let filteredArray = [];

        benefitArray.forEach(benefit => {
            if(benefitArray.includes(benefit) && !filteredArray.includes(benefit)) {
                filteredArray.push(benefit);
            }
        });

        return filteredArray.toString().replaceAll(",", "\n\t\t");
    }

    private getWorkingHours(requestBody: RequestBody): WorkingHoursEnum {
        if(requestBody.city == CityEnum.SORRISO || requestBody.city == CityEnum.CUIABA) {
            return WorkingHoursEnum.CUIABA_SORRISO;
        }
        return WorkingHoursEnum.DEFAULT_WEEK;
    }

    public createMessageVariables(requestBody: RequestBody): MessageVariables {
        return new MessageVariables(
            this.getJobComplement(requestBody),
            this.getCity(requestBody),
            this.getBaseSalary(requestBody),
            this.getVr(requestBody),
            this.getModality(requestBody),
            this.getContractType(requestBody),
            this.getExtraBenefits(requestBody),
            this.getWorkingHours(requestBody)
        );
    }
}
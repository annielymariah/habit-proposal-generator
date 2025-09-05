import { ContractTypeEnum } from "../enums/contract-type.enum";
import { JobComplementEnum } from "../enums/job-complement.enum";
import { WorkingHoursEnum } from "../enums/working-hours.enum";
import { CityEnum } from "../enums/city.enum";
import { BenefitEnum } from "../enums/benefit.enum";

export class MessageVariables {
    jobComplement: JobComplementEnum;
    city: CityEnum;
    baseSalary: string;
    vr: string;
    assuityValue: string;
    modality: "presential" | "homeoffice";
    contractType: ContractTypeEnum;
    extraBenefitsList: string;
    workingHours: WorkingHoursEnum;

    constructor(
        jobComplement: JobComplementEnum,
        city: CityEnum,
        baseSalary: string,
        vrMessage: string,
        modality: "presential" | "homeoffice",
        contractType: ContractTypeEnum,
        extraBenefitsList: string,
        workingHours: WorkingHoursEnum
    ) {
        this.jobComplement = jobComplement;
        this.city = city;
        this.baseSalary = baseSalary;
        this.vr = vrMessage;
        this.modality = modality;
        this.contractType = contractType;
        this.extraBenefitsList = extraBenefitsList;
        this.workingHours = workingHours;
    }
}

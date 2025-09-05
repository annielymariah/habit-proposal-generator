import { ContractTypeEnum } from "../models/enums/contract-type.enum";
import { JobComplementEnum } from "../models/enums/job-complement.enum";
import { CityEnum } from "../models/enums/city.enum";

export interface RequestBody {
    job: JobComplementEnum,
    city: CityEnum,
    modality: "presential" | "homeoffice",
    contractType: ContractTypeEnum
}
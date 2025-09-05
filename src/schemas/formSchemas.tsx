import { z } from "zod";
import { JobEnum, JobComplementEnum, LocationEnum, ModalityEnum, ContractTypeEnum } from "../enums";

export const JOBS_WITH_REQUIRED_COMPLEMENT = [
  JobEnum.ENCARREGADO,
  JobEnum.MEIO_OFICIAL,
  JobEnum.AUXILIAR,
  JobEnum.AJUDANTE,
  JobEnum.PROFISSIONAL,
] as const;

export type JobWithComplement = typeof JOBS_WITH_REQUIRED_COMPLEMENT[number];

export const needsJobComplement = (job: JobEnum): job is JobWithComplement => {
  return JOBS_WITH_REQUIRED_COMPLEMENT.includes(job as JobWithComplement);
};

export const formSchema = z.object({
  job: z.enum(JobEnum),
  jobComplement: z.enum(JobComplementEnum).optional(),
  finalJob: z.string().optional(),
  location: z.enum(LocationEnum),
  modality: z.enum(ModalityEnum),
  contractType: z.enum(ContractTypeEnum),
}).refine((data) => {
  if (needsJobComplement(data.job)) {
    return data.jobComplement !== undefined;
  }
  return true;
}, {
  message: "Complemento do cargo é obrigatório para este cargo",
  path: ["jobComplement"],
});

export type FormValues = z.infer<typeof formSchema>;

export type ProcessedFormValues = {
  job: JobEnum; 
  jobComplement?: JobComplementEnum;
  finalJob: string;
  location: LocationEnum;
  modality: ModalityEnum;
  contractType: ContractTypeEnum;
};
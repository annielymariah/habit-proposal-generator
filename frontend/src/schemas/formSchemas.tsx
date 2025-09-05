import { z } from "zod";
import { Job, JobComplement, Location, Modality, ContractType } from "../enums";

export const JOBS_WITH_REQUIRED_COMPLEMENT = [
  Job.ENCARREGADO,
  Job.MEIO_OFICIAL,
  Job.AUXILIAR,
  Job.AJUDANTE,
  Job.PROFISSIONAL,
] as const;

export type JobWithComplement = typeof JOBS_WITH_REQUIRED_COMPLEMENT[number];

export const needsJobComplement = (job: Job): job is JobWithComplement => {
  return JOBS_WITH_REQUIRED_COMPLEMENT.includes(job as JobWithComplement);
};

export const formSchema = z.object({
  job: z.enum([
    Job.ALMOXARIFE,
    Job.AUXILIAR_ALMOXARIFADO,
    Job.APONTADOR,
    Job.ELETRICISTA,
    Job.ENCANADOR,
    Job.VIGIA,
    Job.MOTOBOY_I,
    Job.MOTOBOY_II,
    Job.MOTOBOY_III,
    Job.OPERADOR_TRATOR_I,
    Job.OPERADOR_TRATOR_II,
    Job.OPERADOR_TRATOR_III,
    Job.ASSISTENTE_ADMIN_JUNIOR,
    Job.ASSISTENTE_ADMIN_PLENO,
    Job.ASSISTENTE_ADMIN_SENIOR,
    Job.DESENVOLVEDOR_JUNIOR,
    Job.DESENVOLVEDOR_PLENO,
    Job.DESENVOLVEDOR_SENIOR,
    Job.ENCARREGADO,
    Job.MEIO_OFICIAL,
    Job.AUXILIAR,
    Job.AJUDANTE,
    Job.PROFISSIONAL,
  ] as const),
  jobComplement: z.enum([
    JobComplement.ARMADOR,
    JobComplement.CARPINTEIRO,
    JobComplement.PEDREIRO,
    JobComplement.PINTOR,
    JobComplement.GESSEIRO,
    JobComplement.REJUNTADOR,
    JobComplement.ELETRICISTA,
    JobComplement.SOLDADOR,
    JobComplement.SERRALHEIRO,
  ] as const).optional(),
  location: z.enum([
    Location.CUIABA,
    Location.SORRISO,
    Location.RONDONOPOLIS,
    Location.SINOP,
    Location.ALTA_FLORESTA,
    Location.PATOS,
  ] as const),
  modality: z.enum([
    Modality.PRESENCIAL,
    //Modality.REMOTO,
  ] as const),
  contractType: z.enum([
    ContractType.CLT,
    //ContractType.PJ,
    //ContractType.DAILY,
    //ContractType.INTERNSHIP,
  ] as const),
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
  job: string; 
  location: Location;
  modality: Modality;
  contractType: ContractType;
};
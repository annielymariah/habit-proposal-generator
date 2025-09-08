import { z } from "zod";
import {
  JobEnum,
  JobComplementEnum,
  LocationEnum,
  ModalityEnum,
  ContractTypeEnum,
} from "../enums";

export const JOBS_WITH_REQUIRED_COMPLEMENT = [
  JobEnum.TECNICO,
  JobEnum.ENCARREGADO,
  JobEnum.MEIO_OFICIAL,
  JobEnum.AUXILIAR,
  JobEnum.AJUDANTE,
  JobEnum.PROFISSIONAL,
] as const;

export type JobWithComplement = (typeof JOBS_WITH_REQUIRED_COMPLEMENT)[number];

export const needsJobComplement = (job: JobEnum): job is JobWithComplement => {
  return JOBS_WITH_REQUIRED_COMPLEMENT.includes(job as JobWithComplement);
};

// Mapeamento de complementos válidos

// Obs. Completar Auxiliares

export const validJobComplements: Record<JobEnum, JobComplementEnum[]> = {

  [JobEnum.TECNICO]: [
    JobComplementEnum.MANUTENCAO_PREDIAL,
    JobComplementEnum.INSTALADOR_REFRIGERACAO,
  ],
  [JobEnum.PROFISSIONAL]: [
    JobComplementEnum.ALMOXARIFADO,
    JobComplementEnum.ARMADOR,
    JobComplementEnum.CARPINTEIRO,
    JobComplementEnum.PEDREIRO,
    JobComplementEnum.PINTOR,
    JobComplementEnum.GESSEIRO,
    JobComplementEnum.SOLDADOR,
    JobComplementEnum.SERRALHEIRO,
    JobComplementEnum.MECANICO,
    JobComplementEnum.JARDINEIRO,
  ],
  [JobEnum.ENCARREGADO]: [
    JobComplementEnum.ELETRICISTA,
    JobComplementEnum.OBRAS,
    JobComplementEnum.MANUTENCAO,
  ],
  [JobEnum.MEIO_OFICIAL]: [
    JobComplementEnum.ALMOXARIFADO,
    JobComplementEnum.CARPINTEIRO,
    JobComplementEnum.ELETRICISTA,
    JobComplementEnum.ENCANAMENTO,
    JobComplementEnum.PEDREIRO,
    JobComplementEnum.PINTOR,
    JobComplementEnum.GESSEIRO,
    JobComplementEnum.SOLDADOR,
    JobComplementEnum.SERRALHEIRO,
    JobComplementEnum.MECANICO,
    JobComplementEnum.JARDINEIRO,
  ],
  [JobEnum.AUXILIAR]: [ 
    JobComplementEnum.MANUTENCAO_PREDIAL,
    JobComplementEnum.INSTALADOR_REFRIGERACAO,
  ],
  [JobEnum.AJUDANTE]: [
    JobComplementEnum.ELETRICISTA,
    JobComplementEnum.JARDINEIRO,
    JobComplementEnum.MECANICO,
    JobComplementEnum.OBRAS,
    JobComplementEnum.PINTOR,
    JobComplementEnum.SERRALHEIRO,
    JobComplementEnum.SOLDADOR,
  ],

  [JobEnum.MECANICO]: [],
  [JobEnum.ALMOXARIFE]: [],
  [JobEnum.APONTADOR]: [],
  [JobEnum.ELETRICISTA]: [],
  [JobEnum.ENCANADOR]: [],
  [JobEnum.VIGIA]: [],
  [JobEnum.MOTOBOY_I]: [],
  [JobEnum.MOTOBOY_II]: [],
  [JobEnum.MOTOBOY_III]: [],
  [JobEnum.OPERADOR_TRATOR_I]: [],
  [JobEnum.OPERADOR_TRATOR_II]: [],
  [JobEnum.OPERADOR_TRATOR_III]: [],
  [JobEnum.ASSISTENTE_ADMIN_JUNIOR]: [],
  [JobEnum.ASSISTENTE_ADMIN_PLENO]: [],
  [JobEnum.ASSISTENTE_ADMIN_SENIOR]: [],
  [JobEnum.DESENVOLVEDOR_JUNIOR]: [],
  [JobEnum.DESENVOLVEDOR_PLENO]: [],
  [JobEnum.DESENVOLVEDOR_SENIOR]: [],
};

const requiredEnum = <T extends Record<string, string>>(
  e: T,
  message: string
) => z.enum(e).refine((val) => !!val, { message });

export const formSchema = z
  .object({
    job: requiredEnum(JobEnum, "Por favor, selecione um cargo"),
    jobComplement: z.enum(JobComplementEnum).optional(),
    finalJob: z.string().optional(),
    location: requiredEnum(
      LocationEnum,
      "Por favor, selecione uma localização"
    ),
    modality: requiredEnum(ModalityEnum, "Por favor, selecione uma modalidade"),
    contractType: requiredEnum(
      ContractTypeEnum,
      "Por favor, selecione um tipo de contrato"
    ),
  })
  .refine(
    (data) => {
      if (needsJobComplement(data.job)) {
        return data.jobComplement !== undefined;
      }
      return true;
    },
    {
      message: "Complemento do cargo é obrigatório para este cargo",
      path: ["jobComplement"],
    }
  )
  .refine(
    (data) => {
      if (needsJobComplement(data.job) && data.jobComplement) {
        const validComplements = validJobComplements[data.job];
        return validComplements.includes(data.jobComplement);
      }
      return true;
    },
    {
      message: "Complemento inválido para este cargo",
      path: ["jobComplement"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;

export interface ProcessedFormValues {
  job: JobEnum;
  jobComplement?: JobComplementEnum;
  finalJob: string;
  location: LocationEnum;
  modality: ModalityEnum;
  contractType: ContractTypeEnum;
}

// Função auxiliar para obter complementos válidos

export const getValidComplements = (job: JobEnum): JobComplementEnum[] => {
  return validJobComplements[job] || [];
};

// Função para gerar o nome final do job

export const generateFinalJobName = (
  job: JobEnum,
  jobComplement?: JobComplementEnum
): string => {
  if (jobComplement && needsJobComplement(job)) {
    return `${job} de ${jobComplement}`;
  }
  return job;
};

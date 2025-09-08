import { type ProcessedFormValues } from "@/schemas/formSchemas";

export function generateProposal(values: ProcessedFormValues): string {
  const salaryTable: Record<string, number> = {
    "Almoxarife": 2389,
    "Auxiliar de Almoxarifado": 1925,
    "Apontador": 1925,
    "Encanador": 2469,
    "Vigia": 1779,
    "Motoboy I": 2389,
    "Motoboy II": 2389,
    "Motoboy III": 2389,
    "Operador de Trator I": 1925,
    "Operador de Trator II": 2389,
    "Operador de Trator III": 2389,
    "Assistente Administrativo Junior": 2000,
    "Assistente Administrativo Pleno": 2500,
    "Assistente Administrativo Senior": 2500,
    "Desenvolvedor Junior": 1518,
    "Desenvolvedor Pleno": 2000,
    "Desenvolvedor Senior": 2500,

    
    "Eletricista": 2469,
    "Encarregado": 3195,
    "Meio-Oficial": 1925,
    "Auxiliar": 1925,
    "Ajudante": 1779,
    "Profissional": 2389,
  };

  const vrTable: Record<string, string | number> = {
    "Sorriso, Mato Grosso": "➡ Fornecemos almoço no local de segunda a sexta-feira e café da manhã de segunda a sábado.",
    "Cuiabá, Mato Grosso": "➡ Vale Refeição, considerando o valor de 16,00R$ por dia útil trabalhado.",
    "Rondonópolis, Mato Grosso": "➡ Vale Refeição, considerando o valor de 20,00R$ por dia útil trabalhado.",
    "Sinop, Mato Grosso": "➡ Vale Refeição, considerando o valor de 20,00R$ por dia útil trabalhado.",
    "Alta Floresta, Mato Grosso": "➡ Vale Refeição, considerando o valor de 20,00R$ por dia útil trabalhado.",
    "Patos, Paraíba": "➡ Vale Refeição, considerando o valor de 20,00R$ por dia útil trabalhado.",
  };

  const getSchedules = (location: string) => {
    if (location === "Sorriso, Mato Grosso" || location === "Cuiabá, Mato Grosso") {
      return {
        weekday: { start: "07:30", end: "16:30", break: "1h" },
        saturday: { start: "07:30", end: "11:30" },
      };
    }
    return {
      weekday: { start: "07:00", end: "17:00", break: "2h" },
      saturday: { start: "07:00", end: "11:00" },
    };
  };

  const getAssiduidade = (job: string) => (job.toLowerCase().includes("ajudante") ? 395 : 250);

  const getAdicionais = (job: string, jobComplement?: string) => {
    const adicionais: string[] = [];
    const jobLower = job.toLowerCase();
    const complementLower = jobComplement?.toLowerCase() || "";

    if (jobLower.includes("eletricista") || complementLower.includes("eletricista")) {
      adicionais.push("➡ 30% de periculosidade sobre o salário base.");
    }
    if (jobLower.includes("encanador") || complementLower.includes("encanador")) {
      adicionais.push("➡ 20% de insalubridade sobre o salário mínimo vigente.");
    }
    if (complementLower.includes("serralheiro")) {
      adicionais.push("➡ 20% de insalubridade sobre o salário mínimo vigente.");
    }
    if (jobLower.includes("encarregado") && jobLower.includes("meio-oficial") && jobLower.includes("ajudante") && jobLower.includes("profissional")) {
      adicionais.push("➡ Prêmio por atividades excepcionais.");
    }

    return adicionais.join("\n");
  };

  const salary = salaryTable[values.job] || 0;
  const vr = vrTable[values.location] || 0;
  const assiduidade = getAssiduidade(values.finalJob);
  const adicionais = getAdicionais(values.finalJob, values.jobComplement);
  const schedule = getSchedules(values.location);

  return `
*PROPOSTA DE TRABALHO PARA ${values.finalJob.toUpperCase()} EM ${values.location.toLocaleUpperCase()}:*
🔸Local: ${values.location.toUpperCase()}.
🔸Função: ${values.finalJob}.
🔸Salário base de  ${salary}R$.
🔸Modalidade ${values.modality}.
🔸Contratação ${values.contractType}.

*Oferecemos:*
➡ Seguro de vida.
➡ Auxílio Transporte, considerando o valor de 09,90R$ por dia útil trabalhado.
${vr}
➡ Fornecemos café da manhã no local de trabalho de segunda a sábado.
➡ ${assiduidade}R$ de Prêmio Assiduidade, por mês completo de trabalho.
➡ Convênio BR5 assim que finalizado a admissão.
${adicionais ? adicionais : ""}

*Horário de trabalho*
➡ De segunda a sexta, das ${schedule.weekday.start} ás ${schedule.weekday.end}, com intervalo de ${schedule.weekday.break}.
➡ Aos sábados, das ${schedule.saturday.start} ás ${schedule.saturday.end}, sem intervalos.

Proposta válida por 15 dias após a admissão.
`;
}

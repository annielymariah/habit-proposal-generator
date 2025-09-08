import { type ProcessedFormValues } from "@/schemas/formSchemas";

export function generateProposal(values: ProcessedFormValues): string {

  const salaryTable: Record<string, number> = {
    Almoxarife: 2389,
    Apontador: 1925,
    Encanador: 2469,
    Vigia: 1779,
    Eletricista: 2469,
    Encarregado: 3195,
    "Meio-Oficial": 1925,
    Auxiliar: 1925,
    Ajudante: 1779,
    Profissional: 2389,
    Técnico: 2389,
    Mecânico: 3000,
    Motoboy: 1925,
    "Motorista (Cat. B)": 2389,
    "Motorista (Cat. D)": 2478.6,
    "Operador de Trator": 1925,
  };

  const vrTable: Record<string, string> = {
    "Sorriso, Mato Grosso":
      "➡ Fornecemos almoço no local de segunda a sexta-feira e café da manhã de segunda a sábado.",
    "Cuiabá, Mato Grosso":
      "➡ Vale Refeição, considerando o valor de R$16,00 por dia útil trabalhado.",
    "Rondonópolis, Mato Grosso":
      "➡ Vale Refeição, considerando o valor de R$20,00 por dia útil trabalhado.",
    "Sinop, Mato Grosso":
      "➡ Vale Refeição, considerando o valor de R$20,00 por dia útil trabalhado.",
    "Alta Floresta, Mato Grosso":
      "➡ Vale Refeição, considerando o valor de R$20,00 por dia útil trabalhado.",
    "Patos, Paraíba":
      "➡ Vale Refeição, considerando o valor de R$20,00 por dia útil trabalhado.",
  };

  const scheduleTable: Record<string, { weekday: { start: string; end: string; break: string }; saturday: { start: string; end: string } }> = {
    "Sorriso, Mato Grosso": {
      weekday: { start: "07:30", end: "16:30", break: "1h" },
      saturday: { start: "07:30", end: "11:30" }
    },
    "Cuiabá, Mato Grosso": {
      weekday: { start: "07:30", end: "16:30", break: "1h" },
      saturday: { start: "07:30", end: "11:30" }
    },
    "default": {
      weekday: { start: "07:00", end: "17:00", break: "2h" },
      saturday: { start: "07:00", end: "11:00" }
    }
  };

  // Benefícios

  const benefitsConfig = {
    periculosidade: [
      "eletricista",
      "instalador de equipamentos de refrigeração e ventilação",
      "motoboy"
    ],
    insalubridade: [
      "encanador",
      "serralheiro"
    ],
    premioAtividades: [
      "técnico", "eletricista", "encarregado", "meio-oficial", 
      "ajudante", "profissional"
    ],
    cafeManha: [
      "técnico", "eletricista", "encarregado", "meio-oficial", 
      "ajudante", "profissional"
    ]
  };

  const checklistPremiums: Record<string, number> = {
    "nível 1": 100,
    "nível 2": 200,
    "nível 3": 300
  };

  const motoristaPremium = 500;

  // Ajustes de salário

  const jobLower = values.finalJob.toLowerCase();
  const complementLower = values.jobComplement?.toLowerCase() || "";
  
  const nivelJobs = ["motoboy", "operador de trator"];
  const hasNivelJob = nivelJobs.some(job => jobLower.includes(job));
  
  if (hasNivelJob) {
    const isNivel2Or3 = complementLower.includes("nível 2") || complementLower.includes("nível 3");
    const adjustedSalary = isNivel2Or3 ? 2389 : 1925;
    
    if (jobLower.includes("motoboy")) salaryTable["Motoboy"] = adjustedSalary;
    if (jobLower.includes("operador de trator")) salaryTable["Operador de Trator"] = adjustedSalary;
  }

  // Funções auxiliares

  const getSchedules = (location: string) => {
    return scheduleTable[location] || scheduleTable.default;
  };

  const getAttendance = (job: string) => 
    job.toLowerCase().includes("ajudante") ? 395 : 250;

  const hasAnyKeyword = (text: string, keywords: string[]) => 
    keywords.some(keyword => text.includes(keyword));

  const getAddictionals = (job: string, jobComplement?: string) => {
    const addictionals: string[] = [];
    const jobText = job.toLowerCase();
    const complementText = jobComplement?.toLowerCase() || "";
    const fullText = `${jobText} ${complementText}`;

    // Periculosidade

    if (hasAnyKeyword(fullText, benefitsConfig.periculosidade)) {
      addictionals.push("➡ 30% de periculosidade sobre o salário base.");
    }

    // Insalubridade

    if (hasAnyKeyword(fullText, benefitsConfig.insalubridade)) {
      addictionals.push("➡ 20% de insalubridade sobre o salário mínimo vigente.");
    }

    // Prêmio por atividades excepcionais e café da manhã

    const shouldAddPremium = hasAnyKeyword(fullText, benefitsConfig.premioAtividades) || 
      (jobText.includes("auxiliar") && 
       complementText.includes("instalador de equipamentos de refrigeração e ventilação") &&
       !hasAnyKeyword(complementText, ["mecânico", "almoxarifado"]));

    if (shouldAddPremium) {
      addictionals.push(
        "➡ Prêmio por atividades excepcionais.",
        "➡ Fornecemos café da manhã no local de trabalho de segunda a sábado."
      );
    }

    // Prêmios de checklist para motoristas

    if (jobText.includes("motorista")) {
      addictionals.push(`➡ R$${motoristaPremium} de Prêmio por entrega de checklist do veículo (mensal).`);
    }

    // Prêmios de checklist para motoboy e operador de trator

    const nivelJobs = ["motoboy", "operador de trator"];
    if (hasAnyKeyword(jobText, nivelJobs)) {
      for (const [nivel, premio] of Object.entries(checklistPremiums)) {
        if (complementText.includes(nivel)) {
          addictionals.push(`➡ R$${premio} de Prêmio por entrega de checklist do veículo (mensal).`);
        }
      }
    }

    return addictionals.join("\n");
  };

  const salary = salaryTable[values.job] || 0;
  const vr = vrTable[values.location] || "";
  const attendance = getAttendance(values.finalJob);
  const addictionals = getAddictionals(values.finalJob, values.jobComplement);
  const schedule = getSchedules(values.location);

  return `
*PROPOSTA DE TRABALHO PARA ${values.finalJob.toUpperCase()} EM ${values.location.toUpperCase()}:*
🔸Local: ${values.location.toUpperCase()}.
🔸Função: ${values.finalJob}.
🔸Salário base de R$${salary}.
🔸Modalidade ${values.modality}.
🔸Contratação ${values.contractType}.

*Oferecemos:*
➡ Seguro de vida.
➡ Auxílio Transporte, considerando o valor de R$09,90 por dia útil trabalhado.
${vr}
➡ R$${attendance} de Prêmio Assiduidade, por mês completo de trabalho.
➡ Convênio BR5 assim que finalizado a admissão.
${addictionals ? addictionals : ""}

*Horário de trabalho*
➡ De segunda a sexta, das ${schedule.weekday.start} ás ${schedule.weekday.end}, com intervalo de ${schedule.weekday.break}.
➡ Aos sábados, das ${schedule.saturday.start} ás ${schedule.saturday.end}, sem intervalos.

Proposta válida por 15 dias após envio.
`;
}
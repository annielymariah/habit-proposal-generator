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

  const vrTable: Record<string, string | number> = {
    "Sorriso, Mato Grosso":
      "➡ Fornecemos almoço no local de segunda a sexta-feira e café da manhã de segunda a sábado.",
    "Cuiabá, Mato Grosso":
      "➡ Vale Refeição, considerando o valor de 16,00R$ por dia útil trabalhado.",
    "Rondonópolis, Mato Grosso":
      "➡ Vale Refeição, considerando o valor de 20,00R$ por dia útil trabalhado.",
    "Sinop, Mato Grosso":
      "➡ Vale Refeição, considerando o valor de 20,00R$ por dia útil trabalhado.",
    "Alta Floresta, Mato Grosso":
      "➡ Vale Refeição, considerando o valor de 20,00R$ por dia útil trabalhado.",
    "Patos, Paraíba":
      "➡ Vale Refeição, considerando o valor de 20,00R$ por dia útil trabalhado.",
  };

  const jobLower = values.finalJob.toLowerCase();
  const complementLower = values.jobComplement?.toLowerCase() || "";

  if (jobLower.includes("motoboy") || jobLower.includes("operador de trator")) {
    if (
      complementLower.includes("nível 2") ||
      complementLower.includes("nível 3")
    ) {
      salaryTable["Motoboy"] = 2389;
      salaryTable["Operador de Trator"] = 2389;
    } else {
      salaryTable["Motoboy"] = 1925;
      salaryTable["Operador de Trator"] = 2389;
    }
  }

  const getSchedules = (location: string) => {
    if (
      location === "Sorriso, Mato Grosso" ||
      location === "Cuiabá, Mato Grosso"
    ) {
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

  const getAttendance = (job: string) =>
    job.toLowerCase().includes("ajudante") ? 395 : 250;

  const getAddictionals = (job: string, jobComplement?: string) => {
    const addictionals: string[] = [];
    const jobLower = job.toLowerCase();
    const complementLower = jobComplement?.toLowerCase() || "";

    if (
      jobLower.includes("eletricista") ||
      complementLower.includes("eletricista") ||
      complementLower.includes(
        "instalador de equipamentos de refrigeração e ventilação"
      ) ||
      jobLower.includes("motoboy")
    ) {
      addictionals.push("➡ 30% de periculosidade sobre o salário base.");
    }
    if (
      jobLower.includes("encanador") ||
      complementLower.includes("encanador")
    ) {
      addictionals.push(
        "➡ 20% de insalubridade sobre o salário mínimo vigente."
      );
    }

    if (complementLower.includes("serralheiro")) {
      addictionals.push(
        "➡ 20% de insalubridade sobre o salário mínimo vigente."
      );
    }
    if (
      jobLower.includes("técnico") ||
      jobLower.includes("eletricista") ||
      jobLower.includes("encarregado") ||
      jobLower.includes("meio-oficial") ||
      jobLower.includes("ajudante") ||
      jobLower.includes("profissional") ||
      (jobLower.includes("auxiliar") &&
        complementLower.includes(
          "instalador de equipamentos de refrigeração e ventilação"
        ) &&
        (!complementLower.includes("mecânico") ||
          !complementLower.includes("almoxarifado")))
    ) {
      addictionals.push("➡ Prêmio por atividades excepcionais.");
      addictionals.push(
        "➡ Fornecemos café da manhã no local de trabalho de segunda a sábado."
      );
    }
    if (
      jobLower.includes("motorista (cat. b)") ||
      jobLower.includes("motorista (cat. d)")
    ) {
      addictionals.push(
        "➡ 500R$ de Prêmio por entrega de checklist do veículo (mensal)."
      );
    }
    if (
      (jobLower.includes("motoboy") ||
        jobLower.includes("operador de trator")) &&
      complementLower.includes("nível 1")
    ) {
      addictionals.push(
        "➡ 100R$ de Prêmio por entrega de checklist do veículo (mensal)."
      );
    }
    if (
      (jobLower.includes("motoboy") ||
        jobLower.includes("operador de trator")) &&
      complementLower.includes("nível 2")
    ) {
      addictionals.push(
        "➡ 200R$ de Prêmio por entrega de checklist do veículo (mensal)."
      );
    }
    if (
      (jobLower.includes("motoboy") ||
        jobLower.includes("operador de trator")) &&
      complementLower.includes("nível 3")
    ) {
      addictionals.push(
        "➡ 300R$ de Prêmio por entrega de checklist do veículo (mensal)."
      );
    }
    return addictionals.join("\n");
  };

  const salary = salaryTable[values.job] || 0;
  const vr = vrTable[values.location] || 0;
  const attendance = getAttendance(values.finalJob);
  const addictionals = getAddictionals(values.finalJob, values.jobComplement);
  const schedule = getSchedules(values.location);

  return `
*PROPOSTA DE TRABALHO PARA ${values.finalJob.toUpperCase()} EM ${values.location.toLocaleUpperCase()}:*
🔸Local: ${values.location.toUpperCase()}.
🔸Função: ${values.finalJob}.
🔸Salário base de ${salary}R$.
🔸Modalidade ${values.modality}.
🔸Contratação ${values.contractType}.

*Oferecemos:*
➡ Seguro de vida.
➡ Auxílio Transporte, considerando o valor de 09,90R$ por dia útil trabalhado.
${vr}
➡ ${attendance}R$ de Prêmio Assiduidade, por mês completo de trabalho.
➡ Convênio BR5 assim que finalizado a admissão.
${addictionals ? addictionals : ""}

*Horário de trabalho*
➡ De segunda a sexta, das ${schedule.weekday.start} ás ${
    schedule.weekday.end
  }, com intervalo de ${schedule.weekday.break}.
➡ Aos sábados, das ${schedule.saturday.start} ás ${
    schedule.saturday.end
  }, sem intervalos.

Proposta válida por 15 dias após envio.
`;
}

const fs = require('fs');

const salaryMap = {
    "Almoxarife": 2389,
    "Auxiliar de Almoxarifado": 1925,
    "Apontador": 1925,
    "Eletricista": 2469,
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
    
    // Funções com prefixos
    "Encarregado de": 3195,
    "Meio-Oficial de": 1925,
    "Auxiliar de": 1925,
    "Ajudante de": 1779,
    "Profissional de": 2389
};

function getSalaryForJob(jobTitle) {
    if (salaryMap[jobTitle]) {
        return salaryMap[jobTitle];
    }
    
    // Verifica por prefixos
    for (const [prefix, salary] of Object.entries(salaryMap)) {
        if (jobTitle.startsWith(prefix) && prefix.endsWith(' de')) {
            return salary;
        }
    }
    return 2000;
}

function lerDadosDoArquivo() {
    try {
        const dados = fs.readFileSync('dados.txt', 'utf8');
        return JSON.parse(dados);
    } catch (error) {
        console.log("Erro ao ler o arquivo dados.txt:", error.message);
        return null;
    }
}

function gerarProposta(cargo, funcao, cidade, salario) {
    const CIDADE_SORRISO = "SORRISO";
    const CIDADE_CUIABA = "CUIABÁ";
    const CIDADE_CUIABA_ALT = "CUIABA";
    
    const CARGO_AJUDANTE = "AJUDANTE";
    const CARGOS_SEM_PREMIO = ["ALMOXARIFE", "APONTADOR", "ENCARREGADO"];
    
    const VR_SORRISO = 0;
    const VR_CUIABA = 16.00;
    const VR_OUTRAS_CIDADES = 20.00;
    
    const PREMIO_AJUDANTE = 395.00;
    const PREMIO_OUTROS_CARGOS = 250.00;
    
    const HORARIO_PADRAO = {
        diasUteis: "07:30 às 16:30",
        sabado: "07:30 às 11:30",
        intervalo: "1h"
    };
    
    const HORARIO_ADAPTADO = {
        diasUteis: "07:00 às 17:00", 
        sabado: "07:00 às 11:00",
        intervalo: "2h"
    };

    const cidadeUpper = cidade.toUpperCase();
    const cargoUpper = cargo.toUpperCase();

    let vrValor;
    let horario;
    
    if (cidadeUpper === CIDADE_SORRISO) {
        vrValor = VR_SORRISO;
        horario = HORARIO_PADRAO;
    } else if (cidadeUpper === CIDADE_CUIABA || cidadeUpper === CIDADE_CUIABA_ALT) {
        vrValor = VR_CUIABA;
        horario = HORARIO_PADRAO;
    } else {
        vrValor = VR_OUTRAS_CIDADES;
        horario = HORARIO_ADAPTADO;
    }
    
    let premioAssiduidade = cargoUpper === CARGO_AJUDANTE 
        ? PREMIO_AJUDANTE 
        : PREMIO_OUTROS_CARGOS;
    
    const temPremio = !CARGOS_SEM_PREMIO.includes(cargoUpper);
    
    const salarioFormatado = formatarSalario(salario);
    
    return construirPropostaTexto(
        cargoUpper,
        cidadeUpper,
        funcao,
        salarioFormatado,
        vrValor,
        premioAssiduidade,
        temPremio,
        horario
    );
}

function formatarSalario(salario) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(salario);
}

function construirPropostaTexto(cargo, cidade, funcao, salarioFormatado, vrValor, premioAssiduidade, temPremio, horario) {
    const beneficios = [
        "➡ Auxílio Transporte, considerando o valor de R$09,90 por dia útil trabalhado.",
        vrValor > 0 
            ? `➡ Vale Refeição, considerando o valor of R$${vrValor.toFixed(2)} por dia útil trabalhado.` : null,
        `➡ R$${premioAssiduidade.toFixed(2)} de Prêmio Assiduidade, por mês completo de trabalho.`,
        temPremio ? "➡ Prêmio por atividades excepcionais." : null,
        "➡ Convênio BR5 assim que finalizado a admissão.",
        "➡ Seguro de vida."
    ].filter(beneficio => beneficio !== null);

    return `*PROPOSTA DE TRABALHO PARA ${cargo} EM ${cidade}:*
🔸 Local: ${cidade}.
🔸 Função: ${funcao}
🔸 Salário base de R$${salarioFormatado}.
🔸 Modalidade CLT - com registro em carteira de trabalho.

*Oferecemos:*
${beneficios.join('\n')}

*Horário de trabalho:*
➡ De segunda a sexta-feira, das ${horario.diasUteis}, com ${horario.intervalo} para intervalo.
➡ Aos sábados das ${horario.sabado}, sem intervalo.

Proposta de trabalho válida por 15 dias após envio.`;
}

function gerarNomeArquivo(cargo, cidade) {
    return `proposta_${cargo.toLowerCase().replace(/ /g, '_')}_${cidade.toLowerCase().replace(/ /g, '_')}.txt`;
}

function salvarProposta(cargo, funcao, cidade, salario, nomeArquivo = null) {
    if (!nomeArquivo) {
        nomeArquivo = gerarNomeArquivo(cargo, cidade);
    }
    
    const propostaTexto = gerarProposta(cargo, funcao, cidade, salario);
    
    try {
        fs.writeFileSync(nomeArquivo, propostaTexto, 'utf8');
        console.log(`Proposta salva em: ${nomeArquivo}`);
        return true;
    } catch (error) {
        console.error(`Erro ao salvar proposta: ${error.message}`);
        return false;
    }
}

function main() {
    console.log("Lendo dados do arquivo...");
    
    const dados = lerDadosDoArquivo();
    
    if (!dados) {
        console.log("Erro: Não foi possível ler os dados do arquivo.");
        return;
    }
    
    console.log("Dados lidos com sucesso!");
    console.log(`- Cargo: ${dados.job}`);
    console.log(`- Local: ${dados.location}`);
    
    const salario = getSalaryForJob(dados.job);
    const cidade = dados.location.split(',')[0];
    
    const nomeArquivo = gerarNomeArquivo(dados.job, cidade);
    salvarProposta(dados.job, dados.job, cidade, salario, nomeArquivo);
    
    console.log("Proposta gerada com sucesso.");
}

main();
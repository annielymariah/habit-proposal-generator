// index.ts
import fs from "fs";
import path from "path";
import { RequestBody } from "./types/request-body";
import { MessageBuilderService } from "./services/message-builder.service";

async function main() {
  const inputPath = path.resolve(__dirname, "../todas-propostas-1757097169669.txt");
  const outputDir = path.resolve(__dirname, "../propostas-prontas");

  // cria a pasta de saída, se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // lê e parseia o arquivo
  const fileContent = fs.readFileSync(inputPath, "utf-8");
  const proposals: RequestBody[] = JSON.parse(fileContent);

  const messageBuilder = new MessageBuilderService();

  proposals.forEach((proposal, index) => {
    try {
      const message = messageBuilder.getMessage(proposal);

      const outFile = path.join(outputDir, proposal.job + "_" + proposal.city + "_" + proposal.contractType + ".txt");

      fs.writeFileSync(outFile, message.trim(), "utf-8");
      console.log(`✅ Arquivo salvo: ${outFile}`);
    } catch (err) {
      console.error(`❌ Erro na proposta ${index + 1}:`, err);
    }
  });
}

main();

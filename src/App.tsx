import Header from "./components/Header/Header";
import ProposalForm from "./components/ProposalForm/ProposalForm";
import { generateProposal } from "./scripts/proposalGenerator";
import { type ProcessedFormValues } from "./schemas/formSchemas";

function App() {

  const downloadTxtFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

 const handleSubmit = (values: ProcessedFormValues) => {
  console.log("Proposta única:", values);

  const proposalText = generateProposal(values);

  console.log(proposalText);

  downloadTxtFile(
    proposalText,
    `${values.job}-${values.contractType}-${values.location}-${Date.now()}.txt`
  );
};
  const handleGenerateAll = async (allProposals: ProcessedFormValues[]) => {
    console.log("Enviando todas as propostas:", allProposals.length);

    allProposals.forEach(proposals => {
        const proposalText = generateProposal(proposals);
    downloadTxtFile(
      proposalText,
      `${proposals.job}-${proposals.contractType}-${proposals.location}-${Date.now()}.txt`
    );    
  });
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-10/12 mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6">
          Gerador de Propostas
        </h1>

        <ProposalForm
          onSubmit={handleSubmit}
          onGenerateAll={handleGenerateAll}
        />
      </div>
    </>
  );
}

export default App;
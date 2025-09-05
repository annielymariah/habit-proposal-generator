import Header from "./components/Header/Header";
import ProposalForm from "./components/ProposalForm/ProposalForm";
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

  const handleSubmit = async (values: ProcessedFormValues) => {
    console.log("Proposta única:", values);

    // Incluir lógica de script pra criar o texto com todas as propostas e baixar um arquivo .txt

    const content = JSON.stringify(values, null, 2);
    downloadTxtFile(content, `proposta-${Date.now()}.txt`);
  };

  const handleGenerateAll = async (allProposals: ProcessedFormValues[]) => {
    console.log("Enviando todas as propostas:", allProposals.length);
    // Incluir lógica de script pra criar o texto com todas as propostas e baixar um arquivo .txt


    const content = JSON.stringify(allProposals, null, 2);
    downloadTxtFile(content, `todas-propostas-${Date.now()}.txt`);
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
//import { useState } from "react";
import Header from "./components/Header/Header";
import ProposalForm from "./components/ProposalForm/ProposalForm";
import { type ProcessedFormValues } from "./schemas/formSchemas";

function App() {
  //const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: ProcessedFormValues) => {
    console.log("Proposta única:", values);
  };

  const handleGenerateAll = async (allProposals: ProcessedFormValues[]) => {
    console.log("Enviando todas as propostas:", allProposals.length);
    console.log(allProposals);
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

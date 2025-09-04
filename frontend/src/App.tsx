import Header from "./components/Header/Header";
import ProposalForm from "./components/ProposalForm/ProposalForm";
import { type ProcessedFormValues } from "./schemas/formSchemas";

function App() {
  const handleSubmit = (values: ProcessedFormValues) => {
    console.log("Dados processados:", values);
    // Inserir lógica adicional aqui, enviar para um servidor ou gerar um documento
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-10/12 mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6">
          Gerador de Propostas
        </h1>
        <ProposalForm onSubmit={handleSubmit} />
        
      </div>
    </>
  );
}

export default App;
import { Button } from "@/components/ui/button";
import { Job, JobComplement, Location, Modality, ContractType } from "@/enums";
import type { ProcessedFormValues } from "@/schemas/formSchemas";
import { needsJobComplement } from "@/schemas/formSchemas";

interface GenerateAllButtonProps {
  onGenerateAll: (proposals: ProcessedFormValues[]) => void;
  className?: string;
}

const GenerateAllButton = ({ onGenerateAll, className }: GenerateAllButtonProps) => {
  const generateAllProposals = () => {
    const allProposals: ProcessedFormValues[] = [];

    Object.values(Job).forEach((job) => {
      const needsComp = needsJobComplement(job);
      
      if (needsComp) {
        Object.values(JobComplement).forEach((complement) => {
          Object.values(Location).forEach((location) => {
            Object.values(Modality).forEach((modality) => {
              Object.values(ContractType).forEach((contractType) => {
                allProposals.push({
                  job: `${job} de ${complement}`,
                  location,
                  modality,
                  contractType,
                });
              });
            });
          });
        });
      } else {
        Object.values(Location).forEach((location) => {
          Object.values(Modality).forEach((modality) => {
            Object.values(ContractType).forEach((contractType) => {
              allProposals.push({
                job,
                location,
                modality,
                contractType,
              });
            });
          });
        });
      }
    });

    onGenerateAll(allProposals);
  };

  const calculateTotalProposals = (): number => {
    let total = 0;
    
    Object.values(Job).forEach((job) => {
      const needsComp = needsJobComplement(job);
      
      if (needsComp) {
        total += Object.values(JobComplement).length * 
                 Object.values(Location).length * 
                 Object.values(Modality).length * 
                 Object.values(ContractType).length;
      } else {
        total += Object.values(Location).length * 
                 Object.values(Modality).length * 
                 Object.values(ContractType).length;
      }
    });
    
    return total;
  };

  const totalProposals = calculateTotalProposals();

  return (
    <div className={className}>
      <Button 
        type="button" 
        className="w-full cursor-pointer"
        onClick={generateAllProposals}
        variant="secondary"
        size={"lg"}
      >
        Gerar Todas as Propostas (Quantidade: {totalProposals})
      </Button>
      
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Gera todas as combinações possíveis de cargo, localização, modalidade e tipo de contrato. <br/>Ps. Alguns tipos de contratação podem não fazer sentido para certos cargos.
      </p>
    </div>
  );
};

export default GenerateAllButton;
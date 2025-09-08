import { Button } from "@/components/ui/button";
import { JobEnum, JobComplementEnum, LocationEnum, ModalityEnum, ContractTypeEnum } from "@/enums";
import type { ProcessedFormValues } from "@/schemas/formSchemas";
import { needsJobComplement } from "@/schemas/formSchemas";

interface GenerateAllButtonProps {
  onGenerateAll: (proposals: ProcessedFormValues[]) => void;
  className?: string;
}

const GenerateAllButton = ({ onGenerateAll, className }: GenerateAllButtonProps) => {
  const generateAllProposals = () => {
    const allProposals: ProcessedFormValues[] = [];

    Object.values(JobEnum).forEach((job) => {
      const needsComp = needsJobComplement(job);
      
      if (needsComp) {
        Object.values(JobComplementEnum).forEach((complement) => {
          Object.values(LocationEnum).forEach((location) => {
            Object.values(ModalityEnum).forEach((modality) => {
              Object.values(ContractTypeEnum).forEach((contractType) => {
                allProposals.push({
                  job,
                  jobComplement: complement,
                  finalJob: `${job} de ${complement}`,
                  location,
                  modality,
                  contractType,
                });
              });
            });
          });
        });
      } else {
        Object.values(LocationEnum).forEach((location) => {
          Object.values(ModalityEnum).forEach((modality) => {
            Object.values(ContractTypeEnum).forEach((contractType) => {
              allProposals.push({
                job,
                jobComplement: undefined,
                finalJob: job, 
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
    
    Object.values(JobEnum).forEach((job) => {
      const needsComp = needsJobComplement(job);
      
      if (needsComp) {
        total += Object.values(JobComplementEnum).length * 
                 Object.values(LocationEnum).length * 
                 Object.values(ModalityEnum).length * 
                 Object.values(ContractTypeEnum).length;
      } else {
        total += Object.values(LocationEnum).length * 
                 Object.values(ModalityEnum).length * 
                 Object.values(ContractTypeEnum).length;
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
        size={"lg"}
      >
        Gerar Todas as Propostas (Total: {totalProposals})
      </Button>
      
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Gera todas as combinações possíveis de cargo, localização, modalidade e tipo de contrato. <br/>Ps. Alguns tipos de contratação podem não fazer sentido para certos cargos.
      </p>
    </div>
  );
};

export default GenerateAllButton;
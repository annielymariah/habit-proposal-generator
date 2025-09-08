import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formSchema,
  type FormValues,
  type ProcessedFormValues,
  needsJobComplement,
  validJobComplements
} from "@/schemas/formSchemas";
import { JobEnum, JobComplementEnum, LocationEnum, ModalityEnum, ContractTypeEnum } from "@/enums";
import GenerateAllButton from "../GenerateAllButton/GenerateAllButton";

interface ProposalSelecterProps {
  onSubmit: (values: ProcessedFormValues) => void;
  onGenerateAll?: (values: ProcessedFormValues[]) => void;
}

const ProposalSelecter = ({ onSubmit, onGenerateAll }: ProposalSelecterProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: undefined,
      jobComplement: undefined,
      finalJob: "",
      location: undefined,
      modality: undefined,
      contractType: undefined,
    },
  });

  const selectedJob = useWatch({
    control: form.control,
    name: "job",
  });

  const selectedJobComplement = useWatch({
    control: form.control,
    name: "jobComplement",
  });

  const needsComplement = selectedJob && needsJobComplement(selectedJob);

  // Obter complementos válidos para o job selecionado
  const validComplements = selectedJob 
    ? validJobComplements[selectedJob as JobEnum] || []
    : [];

  // Limpar complemento quando o job muda ou não precisa de complemento
  React.useEffect(() => {
    if (!needsComplement) {
      form.setValue('jobComplement', undefined);
    }
  }, [needsComplement, form]);

  const handleSubmit = (data: FormValues) => {
    let finalJobValue: string = data.job || "";
    if (data.jobComplement && needsJobComplement(data.job as JobEnum)) {
      finalJobValue = `${data.job} de ${data.jobComplement}`;
    }

    const processedData: ProcessedFormValues = {
      job: data.job as JobEnum,
      jobComplement: data.jobComplement as JobComplementEnum | undefined,
      finalJob: finalJobValue,
      location: data.location as LocationEnum,
      modality: data.modality as ModalityEnum,
      contractType: data.contractType as ContractTypeEnum,
    };

    onSubmit(processedData);
  };

  const isSubmitDisabled = needsComplement && !selectedJobComplement;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

          {/* Campo de Cargo com Checkboxes */}
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                  {Object.values(JobEnum).map((job) => (
                    <FormItem
                      key={job}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value === job}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange(job);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {job}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Complemento com Checkboxes (se necessário) */}
          {needsComplement && validComplements.length > 0 && (
            <FormField
              control={form.control}
              name="jobComplement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Complemento do Cargo <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                    {validComplements.map((jobComplement) => (
                      <FormItem
                        key={jobComplement}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value === jobComplement}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange(jobComplement);
                              } else {
                                field.onChange(undefined);
                              }
                            }}
                            disabled={validComplements.length === 0}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {jobComplement}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Campos restantes mantidos como Select */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma localização" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(LocationEnum).map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma modalidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ModalityEnum).map((modality) => (
                      <SelectItem key={modality} value={modality}>
                        {modality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Contratação</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um tipo de contrato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ContractTypeEnum).map((contractType) => (
                      <SelectItem key={contractType} value={contractType}>
                        {contractType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-6/12 min-w-[280px] mx-auto text-black">
            <Button 
              type="submit"
              variant="secondary" 
              size="lg" 
              className="w-full cursor-pointer"
              disabled={isSubmitDisabled}
            >
              Gerar Proposta
            </Button>
          </div>
        </form>
      </Form>

      {onGenerateAll && (
        <GenerateAllButton onGenerateAll={onGenerateAll} className="w-6/12 min-w-[280px] mx-auto mt-6" />
      )}
    </div>
  );
};

export default ProposalSelecter;
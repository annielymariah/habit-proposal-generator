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
} from "@/schemas/formSchemas";
import { Job, JobComplement, Location, Modality, ContractType } from "@/enums";
import GenerateAllButton from "../GenerateAllButton/GenerateAllButton";

interface ProposalFormProps {
  onSubmit: (values: ProcessedFormValues) => void;
  onGenerateAll?: (values: ProcessedFormValues[]) => void; // Nova prop
}

const ProposalForm = ({ onSubmit, onGenerateAll }: ProposalFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: undefined,
      jobComplement: undefined,
      location: undefined,
      modality: undefined,
      contractType: undefined,
    },
  });

  const selectedJob = useWatch({
    control: form.control,
    name: "job",
  });

  const needsComplement = selectedJob && needsJobComplement(selectedJob);

  const handleSubmit = (data: FormValues) => {
    let finalJob: string = data.job;
    if (data.jobComplement && needsJobComplement(data.job)) {
      finalJob = `${data.job} de ${data.jobComplement}`;
    }

    const processedData: ProcessedFormValues = {
      job: finalJob,
      location: data.location,
      modality: data.modality,
      contractType: data.contractType,
    };

    onSubmit(processedData);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Seus campos de formulário existentes */}
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Job).map((job) => (
                      <SelectItem key={job} value={job}>
                        {job}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {needsComplement && (
            <FormField
              control={form.control}
              name="jobComplement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Complemento do Cargo <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um complemento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(JobComplement).map((jobComplement) => (
                        <SelectItem key={jobComplement} value={jobComplement}>
                          {jobComplement}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma localização" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Location).map((location) => (
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
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma modalidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Modality).map((modality) => (
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
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um tipo de contrato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ContractType).map((contractType) => (
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

          <div className="w-6/12 mx-auto">
            <Button type="submit" size="lg" className="w-full cursor-pointer">
              Gerar Proposta
            </Button>
          </div>
        </form>
      </Form>

      {onGenerateAll && (
        <GenerateAllButton onGenerateAll={onGenerateAll} className="w-6/12 mx-auto mt-6" />
      )}
    </div>
  );
};

export default ProposalForm;

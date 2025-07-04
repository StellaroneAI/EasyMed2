import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const labTestSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  testName: z.string().min(1, "Test name is required"),
  testType: z.string().min(1, "Test type is required"),
  labProvider: z.string().min(1, "Lab provider is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  cost: z.number().min(0, "Cost must be positive"),
  insuranceCovered: z.boolean().default(false),
  instructions: z.string().optional(),
});

type LabTestFormData = z.infer<typeof labTestSchema>;

const testTypes = [
  "Hematology",
  "Biochemistry", 
  "Microbiology",
  "Immunology",
  "Endocrinology",
  "Cardiology",
  "Oncology",
  "Genetics",
];

const labProviders = [
  "Apollo Diagnostics",
  "SRL Diagnostics", 
  "Dr. Lal Pathlabs",
  "Metropolis Healthcare",
  "Thyrocare",
  "Quest Diagnostics",
];

const commonTests = [
  { name: "Complete Blood Count", type: "Hematology", cost: 450 },
  { name: "Lipid Profile", type: "Biochemistry", cost: 800 },
  { name: "Thyroid Function Test", type: "Endocrinology", cost: 950 },
  { name: "HbA1c", type: "Endocrinology", cost: 650 },
  { name: "Liver Function Test", type: "Biochemistry", cost: 600 },
  { name: "Kidney Function Test", type: "Biochemistry", cost: 550 },
  { name: "Vitamin D", type: "Biochemistry", cost: 700 },
  { name: "Vitamin B12", type: "Biochemistry", cost: 500 },
];

export default function LabTestForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ["/api/patients"],
  });

  const form = useForm<LabTestFormData>({
    resolver: zodResolver(labTestSchema),
    defaultValues: {
      patientId: "",
      testName: "",
      testType: "",
      labProvider: "",
      scheduledDate: "",
      cost: 0,
      insuranceCovered: false,
      instructions: "",
    },
  });

  const createLabTestMutation = useMutation({
    mutationFn: async (data: LabTestFormData) => {
      const scheduledDateTime = new Date(data.scheduledDate);
      
      const response = await apiRequest("POST", "/api/lab-tests", {
        patientId: parseInt(data.patientId),
        doctorId: 1, // Using doctor ID 1 for demo
        testName: data.testName,
        testType: data.testType,
        labProvider: data.labProvider,
        scheduledDate: scheduledDateTime,
        cost: data.cost,
        insuranceCovered: data.insuranceCovered,
        instructions: data.instructions,
      });

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lab test ordered successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lab-tests"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to order lab test",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LabTestFormData) => {
    createLabTestMutation.mutate(data);
  };

  const selectCommonTest = (test: typeof commonTests[0]) => {
    form.setValue("testName", test.name);
    form.setValue("testType", test.type);
    form.setValue("cost", test.cost);
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {/* Common Tests Quick Select */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-charcoal mb-3 block">Quick Select Common Tests</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {commonTests.slice(0, 8).map((test) => (
              <Button
                key={test.name}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => selectCommonTest(test)}
                className="text-xs h-auto py-2 px-3"
              >
                {test.name}
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientId">Patient</Label>
              <Select onValueChange={(value) => form.setValue("patientId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient: any) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.user?.firstName} {patient.user?.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.patientId && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.patientId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                {...form.register("testName")}
                placeholder="Enter test name"
                className={form.formState.errors.testName ? "border-red-500" : ""}
              />
              {form.formState.errors.testName && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.testName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testType">Test Type</Label>
              <Select onValueChange={(value) => form.setValue("testType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  {testTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.testType && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.testType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="labProvider">Lab Provider</Label>
              <Select onValueChange={(value) => form.setValue("labProvider", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lab provider" />
                </SelectTrigger>
                <SelectContent>
                  {labProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.labProvider && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.labProvider.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                {...form.register("scheduledDate")}
                className={form.formState.errors.scheduledDate ? "border-red-500" : ""}
              />
              {form.formState.errors.scheduledDate && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.scheduledDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cost">Cost (₹)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                {...form.register("cost", { valueAsNumber: true })}
                className={form.formState.errors.cost ? "border-red-500" : ""}
              />
              {form.formState.errors.cost && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.cost.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="insuranceCovered"
              checked={form.watch("insuranceCovered")}
              onCheckedChange={(checked) => form.setValue("insuranceCovered", !!checked)}
            />
            <Label htmlFor="insuranceCovered" className="text-sm font-normal">
              Insurance Coverage Available
            </Label>
          </div>

          <div>
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              {...form.register("instructions")}
              placeholder="Any special instructions for the patient or lab"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-medical-blue hover:bg-blue-700"
            disabled={createLabTestMutation.isPending}
          >
            {createLabTestMutation.isPending ? "Ordering..." : "Order Lab Test"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

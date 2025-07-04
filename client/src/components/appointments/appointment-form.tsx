import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  type: z.enum(["in-person", "telemedicine"]),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AppointmentForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ["/api/patients"],
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["/api/doctors"],
  });

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      duration: 30,
      type: "in-person",
      reason: "",
      notes: "",
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}`);
      
      const response = await apiRequest("POST", "/api/appointments", {
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        appointmentDate: appointmentDateTime,
        duration: data.duration,
        type: data.type,
        reason: data.reason,
        notes: data.notes,
      });

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    createAppointmentMutation.mutate(data);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-charcoal">Schedule Appointment</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Label htmlFor="doctorId">Doctor</Label>
              <Select onValueChange={(value) => form.setValue("doctorId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor: any) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      Dr. {doctor.user?.firstName} {doctor.user?.lastName} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.doctorId && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.doctorId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="appointmentDate">Date</Label>
              <Input
                id="appointmentDate"
                type="date"
                {...form.register("appointmentDate")}
                className={form.formState.errors.appointmentDate ? "border-red-500" : ""}
              />
              {form.formState.errors.appointmentDate && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.appointmentDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="appointmentTime">Time</Label>
              <Input
                id="appointmentTime"
                type="time"
                {...form.register("appointmentTime")}
                className={form.formState.errors.appointmentTime ? "border-red-500" : ""}
              />
              {form.formState.errors.appointmentTime && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.appointmentTime.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                {...form.register("duration", { valueAsNumber: true })}
                className={form.formState.errors.duration ? "border-red-500" : ""}
              />
              {form.formState.errors.duration && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.duration.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="type">Appointment Type</Label>
            <Select onValueChange={(value) => form.setValue("type", value as "in-person" | "telemedicine")}>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="telemedicine">Telemedicine</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              {...form.register("reason")}
              placeholder="e.g., Annual checkup, Follow-up consultation"
              className={form.formState.errors.reason ? "border-red-500" : ""}
            />
            {form.formState.errors.reason && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Any additional information for the appointment"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-medical-blue hover:bg-blue-700"
            disabled={createAppointmentMutation.isPending}
          >
            {createAppointmentMutation.isPending ? "Scheduling..." : "Schedule Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

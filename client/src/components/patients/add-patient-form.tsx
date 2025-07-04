import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string(),
  gender: z.string(),
  bloodGroup: z.string().optional(),
  aadhaarNumber: z.string().length(12, "Aadhaar number must be 12 digits"),
  address: z.string().min(1, "Address is required"),
  emergencyContact: z.string().min(10, "Emergency contact is required"),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  allergies: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function AddPatientForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      aadhaarNumber: "",
      address: "",
      emergencyContact: "",
      insuranceProvider: "",
      insuranceNumber: "",
      allergies: "",
    },
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: PatientFormData) => {
      // First create user
      const userResponse = await apiRequest("POST", "/api/auth/register", {
        username: data.email,
        email: data.email,
        password: "temporary123", // In real app, handle this properly
        role: "patient",
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });

      const user = await userResponse.json();

      // Then create patient profile
      const patientResponse = await apiRequest("POST", "/api/patients", {
        userId: user.user.id,
        aadhaarNumber: data.aadhaarNumber,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        emergencyContact: data.emergencyContact,
        address: data.address,
        insuranceProvider: data.insuranceProvider,
        insuranceNumber: data.insuranceNumber,
        allergies: data.allergies,
      });

      return patientResponse.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Patient added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add patient",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PatientFormData) => {
    createPatientMutation.mutate(data);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-charcoal">Add New Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                className={form.formState.errors.firstName ? "border-red-500" : ""}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                className={form.formState.errors.lastName ? "border-red-500" : ""}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...form.register("phoneNumber")}
                className={form.formState.errors.phoneNumber ? "border-red-500" : ""}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...form.register("dateOfBirth")}
                className={form.formState.errors.dateOfBirth ? "border-red-500" : ""}
              />
              {form.formState.errors.dateOfBirth && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => form.setValue("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select onValueChange={(value) => form.setValue("bloodGroup", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
            <Input
              id="aadhaarNumber"
              {...form.register("aadhaarNumber")}
              placeholder="12-digit Aadhaar number"
              className={form.formState.errors.aadhaarNumber ? "border-red-500" : ""}
            />
            {form.formState.errors.aadhaarNumber && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.aadhaarNumber.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...form.register("address")}
              className={form.formState.errors.address ? "border-red-500" : ""}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              {...form.register("emergencyContact")}
              className={form.formState.errors.emergencyContact ? "border-red-500" : ""}
            />
            {form.formState.errors.emergencyContact && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.emergencyContact.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input id="insuranceProvider" {...form.register("insuranceProvider")} />
            </div>

            <div>
              <Label htmlFor="insuranceNumber">Insurance Number</Label>
              <Input id="insuranceNumber" {...form.register("insuranceNumber")} />
            </div>
          </div>

          <div>
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea id="allergies" {...form.register("allergies")} placeholder="List any known allergies" />
          </div>

          <Button
            type="submit"
            className="w-full bg-medical-blue hover:bg-blue-700"
            disabled={createPatientMutation.isPending}
          >
            {createPatientMutation.isPending ? "Adding Patient..." : "Add Patient"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

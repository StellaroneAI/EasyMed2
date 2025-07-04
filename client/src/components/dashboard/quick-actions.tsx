import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, CalendarPlus, FileText, FlaskConical } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add New Patient",
      icon: UserPlus,
      className: "bg-medical-blue hover:bg-blue-700",
      onClick: () => console.log("Add Patient"),
    },
    {
      title: "Schedule Appointment",
      icon: CalendarPlus,
      className: "bg-health-green hover:bg-green-700",
      onClick: () => console.log("Schedule Appointment"),
    },
    {
      title: "Create Prescription",
      icon: FileText,
      className: "bg-digital-purple hover:bg-purple-700",
      onClick: () => console.log("Create Prescription"),
    },
    {
      title: "Order Lab Test",
      icon: FlaskConical,
      className: "bg-yellow-500 hover:bg-yellow-600",
      onClick: () => console.log("Order Lab Test"),
    },
  ];

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-charcoal">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            className={`w-full flex items-center justify-between p-3 text-white rounded-lg transition-colors ${action.className}`}
          >
            <span className="font-medium">{action.title}</span>
            <action.icon className="w-5 h-5" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

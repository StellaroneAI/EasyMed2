import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, FlaskConical, Bot } from "lucide-react";
import { DashboardStats } from "@/types";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/demo/dashboard/stats/1"], // Using doctor ID 1 for demo
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cardData = [
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      change: "+2",
      changeText: "from yesterday",
      icon: Calendar,
      iconBg: "bg-medical-blue",
      iconColor: "text-medical-blue",
    },
    {
      title: "Active Patients",
      value: stats?.activePatients || 0,
      change: "+12",
      changeText: "this month",
      icon: Users,
      iconBg: "bg-health-green",
      iconColor: "text-health-green",
    },
    {
      title: "Pending Lab Results",
      value: stats?.pendingLabs || 0,
      change: "2 urgent",
      changeText: "require attention",
      icon: FlaskConical,
      iconBg: "bg-yellow-500",
      iconColor: "text-yellow-600",
    },
    {
      title: "AI Consultations",
      value: stats?.aiConsultations || 0,
      change: "+8",
      changeText: "this week",
      icon: Bot,
      iconBg: "bg-digital-purple",
      iconColor: "text-digital-purple",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardData.map((item, index) => (
        <Card key={index} className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{item.value}</p>
              </div>
              <div className={`w-12 h-12 ${item.iconBg} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <item.icon className={`${item.iconColor} text-xl w-6 h-6`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`${item.iconColor} font-medium`}>{item.change}</span>
              <span className="text-gray-600 ml-1">{item.changeText}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RecentActivity } from "@/types";

export default function RecentActivities() {
  // Mock data for recent activities
  const activities: RecentActivity[] = [
    {
      id: 1,
      type: "lab_result",
      patientName: "Maria Rodriguez",
      description: "Lab results received",
      timestamp: "15 minutes ago",
      color: "bg-health-green",
    },
    {
      id: 2,
      type: "prescription",
      patientName: "David Kim",
      description: "Prescription sent",
      timestamp: "32 minutes ago",
      color: "bg-medical-blue",
    },
    {
      id: 3,
      type: "ai_consultation",
      patientName: "Lisa Thompson",
      description: "AI consultation completed",
      timestamp: "1 hour ago",
      color: "bg-digital-purple",
    },
  ];

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-charcoal">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
              <div>
                <p className="text-sm text-charcoal">
                  {activity.description} for <span className="font-medium">{activity.patientName}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-4 text-medical-blue hover:text-blue-700">
          View All Activities <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

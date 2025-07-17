import StatsCards from "@/components/dashboard/stats-cards";
import TodaySchedule from "@/components/dashboard/today-schedule";
import QuickActions from "@/components/dashboard/quick-actions";
import AiAssistant from "@/components/dashboard/ai-assistant";
import RecentActivities from "@/components/dashboard/recent-activities";
import PatientTable from "@/components/patients/patient-table";
import MedicalRecords from "@/components/records/medical-records";
import PrescriptionManagement from "@/components/prescriptions/prescription-management";
import { useLanguage } from "@/contexts/language-context";

export default function Dashboard() {
  const { t } = useLanguage();
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">{t("dashboard.title")}</h1>
        <p className="text-gray-600">Here's what's happening with your practice today.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>

        {/* Quick Actions & AI Assistant */}
        <div className="space-y-6">
          <QuickActions />
          <AiAssistant />
          <RecentActivities />
        </div>
      </div>

      {/* Patient Management Section */}
      <PatientTable />

      {/* Medical Records & Prescription Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MedicalRecords />
        <PrescriptionManagement />
      </div>
    </main>
  );
}

import { DemographicsChart } from '@/components/dashboard/demographics-chart';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { StatsCards } from '@/components/dashboard/stats-cards';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your party's key metrics and activities.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <DemographicsChart />
        <PerformanceChart />
      </div>
    </div>
  );
}

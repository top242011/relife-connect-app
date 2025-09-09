
import { DemographicsChart } from '@/components/dashboard/demographics-chart';
import { MotionSuccessRateChart } from '@/components/dashboard/motion-success-rate-chart';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { SponsoringMembersTable } from '@/components/dashboard/sponsoring-members-table';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { TopIssuesChart } from '@/components/dashboard/top-issues-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
        <PerformanceChart />
        <DemographicsChart />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Parliamentary Analytics</h2>
        <p className="text-muted-foreground">
            In-depth analysis of legislative activities and member contributions.
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <MotionSuccessRateChart />
        <TopIssuesChart />
        <SponsoringMembersTable />
      </div>
    </div>
  );
}

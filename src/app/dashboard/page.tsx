'use client';

import { DemographicsChart } from '@/components/dashboard/demographics-chart';
import { MotionSuccessRateChart } from '@/components/dashboard/motion-success-rate-chart';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { SponsoringMembersTable } from '@/components/dashboard/sponsoring-members-table';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { TopIssuesChart } from '@/components/dashboard/top-issues-chart';
import { AttendanceReport } from '@/components/dashboard/attendance-report';
import { useLanguage } from '@/hooks/use-language';

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard_title')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard_subtitle')}
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart />
        <DemographicsChart />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('parliamentary_analytics_title')}</h2>
        <p className="text-muted-foreground">
            {t('parliamentary_analytics_subtitle')}
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <MotionSuccessRateChart />
        <TopIssuesChart />
        <SponsoringMembersTable />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('attendance_analytics_title')}</h2>
        <p className="text-muted-foreground">
            {t('attendance_analytics_subtitle')}
        </p>
      </div>
      <AttendanceReport />

    </div>
  );
}

'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useLanguage } from '@/hooks/use-language';
import { PerformanceData } from '@/lib/types';

const performanceData: PerformanceData[] = [
    { month: 'Jan', engagement: 65, legislation: 28, attendance: 80 },
    { month: 'Feb', engagement: 59, legislation: 48, attendance: 85 },
    { month: 'Mar', engagement: 80, legislation: 40, attendance: 75 },
    { month: 'Apr', engagement: 81, legislation: 43, attendance: 90 },
    { month: 'May', engagement: 56, legislation: 55, attendance: 88 },
    { month: 'Jun', engagement: 55, legislation: 45, attendance: 92 },
];


export function PerformanceChart() {
  const { t } = useLanguage();
  const chartConfig = {
    engagement: {
      label: t('engagement'),
      color: 'hsl(var(--chart-2))',
    },
    legislation: {
      label: t('legislation'),
      color: 'hsl(var(--chart-1))',
    },
    attendance: {
        label: t('attendance'),
        color: 'hsl(var(--chart-3))'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('performance_tracking_title')}</CardTitle>
        <CardDescription>{t('performance_tracking_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => t(value.toLowerCase() as any)} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="engagement" stroke="var(--color-engagement)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="legislation" stroke="var(--color-legislation)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="attendance" stroke="var(--color-attendance)" strokeWidth={2} dot={false}/>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

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
import { performanceData } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';

export function PerformanceChart() {
  const { t } = useLanguage();
  const chartConfig = {
    engagement: {
      label: t('engagement'),
      color: 'hsl(var(--primary))',
    },
    legislation: {
      label: t('legislation'),
      color: 'hsl(var(--accent))',
    },
    attendance: {
        label: t('attendance'),
        color: 'hsl(var(--secondary-foreground))'
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

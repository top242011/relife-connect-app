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

export function PerformanceChart() {
  const chartConfig = {
    engagement: {
      label: 'Engagement',
      color: 'hsl(var(--primary))',
    },
    legislation: {
      label: 'Legislation',
      color: 'hsl(var(--accent))',
    },
    attendance: {
        label: 'Attendance',
        color: 'hsl(var(--secondary-foreground))'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Tracking</CardTitle>
        <CardDescription>Key performance metrics over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
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

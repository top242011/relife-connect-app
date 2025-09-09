'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
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
import { demographicsData } from '@/lib/data';

export function DemographicsChart() {
  const chartConfig = {
    members: {
      label: 'Members',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Demographics</CardTitle>
        <CardDescription>Distribution of party members by region</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            data={demographicsData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="region" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
             <Legend />
            <Bar dataKey="members" fill="var(--color-members)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

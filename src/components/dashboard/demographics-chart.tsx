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
import { members } from '@/lib/data';
import { Location } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';

export function DemographicsChart() {
  const { t } = useLanguage();
  const demographicsData = members.reduce((acc, member) => {
    const region = member.location;
    const regionData = acc.find(d => d.region === region);
    if (regionData) {
      regionData.members++;
    } else {
      acc.push({ region, members: 1 });
    }
    return acc;
  }, [] as { region: Location, members: number }[]);


  const chartConfig = {
    members: {
      label: t('members'),
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('demographics_title')}</CardTitle>
        <CardDescription>{t('demographics_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            data={demographicsData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="region" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => t(value as any)} />
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

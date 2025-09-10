'use client';

import * as React from 'react';
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
import { getAllMembers } from '@/lib/supabase/queries';
import { Location, Member } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Skeleton } from '../ui/skeleton';

export function DemographicsChart() {
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [members, setMembers] = React.useState<Member[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const membersData = await getAllMembers();
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch members data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const demographicsData = React.useMemo(() => {
    return members.reduce((acc, member) => {
      if (!member.location) return acc;
      const region = member.location;
      const regionData = acc.find(d => d.region === region);
      if (regionData) {
        regionData.members++;
      } else {
        acc.push({ region, members: 1 });
      }
      return acc;
    }, [] as { region: Location, members: number }[]);
  }, [members]);


  const chartConfig = {
    members: {
      label: t('members'),
      color: 'hsl(var(--primary))',
    },
  };
  
  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[200px] w-full" />
            </CardContent>
        </Card>
    );
  }

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

'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip as Tooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { getAllMeetings } from '@/lib/supabase/queries';
import { Meeting } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Skeleton } from '../ui/skeleton';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function TopIssuesChart() {
    const { t } = useLanguage();
    const [loading, setLoading] = React.useState(true);
    const [meetings, setMeetings] = React.useState<Meeting[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const meetingsData = await getAllMeetings();
                setMeetings(meetingsData);
            } catch (error) {
                console.error("Failed to fetch meetings data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartData = React.useMemo(() => {
        const topics: { [key: string]: number } = {};
        meetings.forEach(meeting => {
            meeting.motions.forEach(motion => {
                const translatedTopic = t(motion.topic as any);
                topics[translatedTopic] = (topics[translatedTopic] || 0) + 1;
            });
        });
        return Object.entries(topics).map(([name, value]) => ({ name, value, fill: 'var(--color-value)' }));
    }, [meetings, t]);

    const chartConfig = chartData.reduce((acc, item, index) => {
        acc[item.name] = { label: item.name, color: COLORS[index % COLORS.length] };
        return acc;
    }, {} as any);

  if (loading) {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className='flex justify-center'>
                <Skeleton className="h-[200px] w-[200px] rounded-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>{t('top_issues_by_motion_title')}</CardTitle>
        <CardDescription>{t('top_issues_by_motion_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className='flex justify-center'>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full max-w-[300px]">
          <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                 const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                 const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                 const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                 return (
                   <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                     {`${(percent * 100).toFixed(0)}%`}
                   </text>
                 );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
             <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

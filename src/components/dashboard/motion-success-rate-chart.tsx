'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
import { getAllMeetings, getAllVotes } from '@/lib/supabase/queries';
import { Meeting, Vote } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Skeleton } from '../ui/skeleton';

export function MotionSuccessRateChart() {
    const { t } = useLanguage();
    const [loading, setLoading] = React.useState(true);
    const [meetings, setMeetings] = React.useState<Meeting[]>([]);
    const [votes, setVotes] = React.useState<Vote[]>([]);

    React.useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [meetingsData, votesData] = await Promise.all([
            getAllMeetings(),
            getAllVotes(),
          ]);
          setMeetings(meetingsData);
          setVotes(votesData);
        } catch (error) {
          console.error("Failed to fetch motion success data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    const chartData = React.useMemo(() => {
        const partySponsored = { total: 0, passed: 0 };
        const nonPartySponsored = { total: 0, passed: 0 };

        meetings.forEach(meeting => {
            meeting.motions.forEach(motion => {
                const ayes = votes.filter(v => v.motionId === motion.id && v.vote === 'Aye').length;
                const nays = votes.filter(v => v.motionId === motion.id && v.vote === 'Nay').length;
                const passed = ayes > nays;

                if (motion.isPartySponsored) {
                    partySponsored.total++;
                    if (passed) partySponsored.passed++;
                } else {
                    nonPartySponsored.total++;
                    if (passed) nonPartySponsored.passed++;
                }
            });
        });
        
        return [
            { name: t('party_sponsored'), passed: partySponsored.total > 0 ? (partySponsored.passed / partySponsored.total) * 100 : 0 },
            { name: t('not_party_sponsored'), passed: nonPartySponsored.total > 0 ? (nonPartySponsored.passed / nonPartySponsored.total) * 100 : 0 },
        ];
    }, [meetings, votes, t]);

  const chartConfig = {
    passed: {
      label: t('passed_rate'),
      color: 'hsl(var(--primary))',
    },
  };
  
  if (loading) {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[200px] w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>{t('motion_success_rate_title')}</CardTitle>
        <CardDescription>{t('motion_success_rate_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="passed" fill="var(--color-passed)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

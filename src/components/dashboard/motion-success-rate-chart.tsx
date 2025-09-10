'use client';

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
import { meetings, votes } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';

export function MotionSuccessRateChart() {
    const { t } = useLanguage();
    const processData = () => {
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
    };

    const chartData = processData();

  const chartConfig = {
    passed: {
      label: t('passed_rate'),
      color: 'hsl(var(--primary))',
    },
  };

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

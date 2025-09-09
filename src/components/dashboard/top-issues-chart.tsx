'use client';

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
import { meetings } from '@/lib/data';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function TopIssuesChart() {
    const processData = () => {
        const topics: { [key: string]: number } = {};
        meetings.forEach(meeting => {
            meeting.motions.forEach(motion => {
                topics[motion.topic] = (topics[motion.topic] || 0) + 1;
            });
        });
        return Object.entries(topics).map(([name, value]) => ({ name, value, fill: 'var(--color-value)' }));
    };

    const chartData = processData();
    const chartConfig = chartData.reduce((acc, item, index) => {
        acc[item.name] = { label: item.name, color: COLORS[index % COLORS.length] };
        return acc;
    }, {} as any)

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Top Issues by Motion</CardTitle>
        <CardDescription>Distribution of motions across different topics</CardDescription>
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

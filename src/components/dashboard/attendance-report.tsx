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
import { meetings, votes, allPartyMembers } from '@/lib/data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';

export function AttendanceReport() {
    const { t } = useLanguage();

    const attendanceData = React.useMemo(() => {
        const data = meetings.map(meeting => {
            const motionIds = meeting.motions.map(m => m.id);
            const absentMembers = new Set(
                votes
                    .filter(v => motionIds.includes(v.motionId) && v.vote === 'Absent')
                    .map(v => v.memberId)
            );
            const leaveMembers = new Set(
                votes
                    .filter(v => motionIds.includes(v.motionId) && v.vote === 'Leave')
                    .map(v => v.memberId)
            );

            return {
                name: meeting.title,
                date: meeting.date,
                absent: absentMembers.size,
                leave: leaveMembers.size
            };
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return data;
    }, []);

    const detailedAbsences = React.useMemo(() => {
        return votes
            .filter(v => v.vote === 'Absent' || v.vote === 'Leave')
            .map(vote => {
                const member = allPartyMembers.find(m => m.id === vote.memberId);
                const meeting = meetings.find(m => m.motions.some(mo => mo.id === vote.motionId));
                return {
                    id: vote.id,
                    memberName: member?.name,
                    memberId: member?.id,
                    meetingTitle: meeting?.title,
                    meetingId: meeting?.id,
                    date: meeting?.date,
                    status: vote.vote
                };
            })
            .sort((a,b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }, []);

    const chartConfig = {
        absent: {
          label: t('absent'),
          color: 'hsl(var(--destructive))',
        },
        leave: {
            label: t('on_leave'),
            color: 'hsl(var(--chart-2))'
        }
      };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t('absences_leaves_per_meeting_title')}</CardTitle>
                    <CardDescription>{t('absences_leaves_per_meeting_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height={300}>
                             <BarChart data={attendanceData} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Legend />
                                <Bar dataKey="absent" stackId="a" fill="var(--color-absent)" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="leave" stackId="a" fill="var(--color-leave)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t('detailed_absence_leave_log_title')}</CardTitle>
                    <CardDescription>{t('detailed_absence_leave_log_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[350px] overflow-y-auto">
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('date')}</TableHead>
                                <TableHead>{t('member')}</TableHead>
                                <TableHead>{t('meeting')}</TableHead>
                                <TableHead>{t('status')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detailedAbsences.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        <Link href={`/members/${item.memberId}`} className="text-primary hover:underline">
                                            {item.memberName}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/meetings/manage/${item.meetingId}`} className="text-primary hover:underline truncate">
                                            {item.meetingTitle}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{t(item.status as any)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

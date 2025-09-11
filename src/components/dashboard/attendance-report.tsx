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
import { getAllMeetings, getAllMembers, getAllVotes } from '@/lib/supabase/queries';
import { Meeting, Member, Vote } from '@/lib/types';

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
import { Skeleton } from '../ui/skeleton';

export function AttendanceReport() {
    const { t } = useLanguage();
    const [loading, setLoading] = React.useState(true);
    const [meetings, setMeetings] = React.useState<Meeting[]>([]);
    const [votes, setVotes] = React.useState<Vote[]>([]);
    const [members, setMembers] = React.useState<Member[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [meetingsData, votesData, membersData] = await Promise.all([
                    getAllMeetings(),
                    getAllVotes(),
                    getAllMembers(),
                ]);
                setMeetings(meetingsData);
                setVotes(votesData);
                setMembers(membersData);
            } catch (error) {
                console.error("Failed to fetch attendance data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const attendanceData = React.useMemo(() => {
        if (!meetings.length || !votes.length) return [];

        return meetings.map(meeting => {
            const absentMemberIds = new Set<string>();
            const onLeaveMemberIds = new Set<string>();

            // A member is absent/on-leave for the meeting if they are marked as such for ANY motion.
            meeting.attendees.forEach(attendeeId => {
                const memberVotesForMeeting = votes.filter(v => 
                    v.memberId === attendeeId && 
                    meeting.motions.some(m => m.id === v.motionId)
                );

                const isAbsent = memberVotesForMeeting.some(v => v.vote === 'Absent');
                const isOnLeave = memberVotesForMeeting.some(v => v.vote === 'Leave');

                if(isAbsent) {
                    absentMemberIds.add(attendeeId);
                } else if(isOnLeave) {
                    onLeaveMemberIds.add(attendeeId);
                }
            });

            return {
                name: meeting.title,
                date: meeting.date,
                absent: absentMemberIds.size,
                leave: onLeaveMemberIds.size,
            };
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [meetings, votes]);

    const detailedAbsences = React.useMemo(() => {
        return votes
            .filter(v => v.vote === 'Absent' || v.vote === 'Leave')
            .map(vote => {
                const member = members.find(m => m.id === vote.memberId);
                const meetingWithMotion = meetings.find(m => m.motions.some(mo => mo.id === vote.motionId));
                return {
                    id: vote.id,
                    memberName: member?.name,
                    memberId: member?.id,
                    meetingTitle: meetingWithMotion?.title,
                    meetingId: meetingWithMotion?.id,
                    date: meetingWithMotion?.date,
                    status: vote.vote
                };
            })
            .filter(item => item.memberName && item.meetingTitle) // Filter out items where member or meeting couldn't be found
            .sort((a,b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }, [votes, members, meetings]);

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

    if (loading) {
        return (
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

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

'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/hooks/use-language';
import { getAllMeetings, getAllMembers } from '@/lib/supabase/queries';
import { Meeting, Member } from '@/lib/types';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export function SponsoringMembersTable() {
    const { t } = useLanguage();
    const [loading, setLoading] = React.useState(true);
    const [meetings, setMeetings] = React.useState<Meeting[]>([]);
    const [members, setMembers] = React.useState<Member[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [meetingsData, membersData] = await Promise.all([
                    getAllMeetings(),
                    getAllMembers(),
                ]);
                setMeetings(meetingsData);
                setMembers(membersData);
            } catch (error) {
                console.error("Failed to fetch sponsoring members data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const memberData = React.useMemo(() => {
        const mps = members.filter(m => m.roles.includes('isMP'));
        const getSponsoredMotionsCount = (mpId: string) => {
            return meetings.flatMap(m => m.motions).filter(motion => motion.sponsorId === mpId).length;
        };

        return mps
            .map(mp => ({
                id: mp.id,
                name: mp.name,
                sponsoredCount: getSponsoredMotionsCount(mp.id),
            }))
            .filter(mp => mp.sponsoredCount > 0)
            .sort((a, b) => b.sponsoredCount - a.sponsoredCount);
    }, [members, meetings]);
    
    if (loading) {
        return (
            <Card className="lg:col-span-1">
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>{t('top_sponsoring_members_title')}</CardTitle>
                <CardDescription>{t('top_sponsoring_members_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('member')}</TableHead>
                            <TableHead className="text-right">{t('sponsored_motions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {memberData.map(mp => (
                            <TableRow key={mp.id}>
                                <TableCell>
                                    <Link href={`/parliament/${mp.id}`} className="font-medium text-primary hover:underline">
                                        {mp.name}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right font-semibold">{mp.sponsoredCount}</TableCell>
                            </TableRow>
                        ))}
                         {memberData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                    {t('no_sponsored_motions_found')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

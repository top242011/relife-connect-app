'use client';

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
import { meetings, mps } from '@/lib/data';
import Link from 'next/link';

export function SponsoringMembersTable() {
    const { t } = useLanguage();
    const getSponsoredMotionsCount = (mpId: string) => {
        return meetings.flatMap(m => m.motions).filter(motion => motion.sponsorId === mpId).length;
    };

    const memberData = mps
        .map(mp => ({
            id: mp.id,
            name: mp.name,
            sponsoredCount: getSponsoredMotionsCount(mp.id),
        }))
        .filter(mp => mp.sponsoredCount > 0)
        .sort((a, b) => b.sponsoredCount - a.sponsoredCount);

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

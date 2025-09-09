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
import { meetings, mps } from '@/lib/data';
import Link from 'next/link';

export function SponsoringMembersTable() {
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
                <CardTitle>Top Sponsoring Members</CardTitle>
                <CardDescription>MPs who have sponsored the most party motions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead className="text-right">Sponsored Motions</TableHead>
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
                                    No sponsored motions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

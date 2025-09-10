'use client'

import { meetings, mps, votes } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, MinusCircle, UserX, XCircle, AlertTriangle, Edit } from "lucide-react";
import { EditProfileForm } from "@/components/members/edit-profile-form";
import { useLanguage } from "@/hooks/use-language";

export default function MPProfilePage({ params }: { params: { id: string } }) {
    const { t } = useLanguage();
    const mp = mps.find(m => m.id === params.id);

    if (!mp) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">{t('mp_not_found_title')}</h1>
                <p className="text-muted-foreground">{t('mp_not_found_subtitle')}</p>
                <Button asChild className="mt-4">
                    <Link href="/parliament">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('back_to_parliament_list')}
                    </Link>
                </Button>
            </div>
        )
    }

    const mpVotes = votes.filter(vote => vote.memberId === mp.id);
    const sponsoredMotions = meetings.flatMap(m => m.motions).filter(motion => motion.sponsorId === mp.id);
    const absences = mpVotes.filter(v => v.vote === 'Absent').length;
    const ABSENCE_THRESHOLD = 1;

    const getVoteResult = (motionId: string) => {
        const ayes = votes.filter(v => v.motionId === motionId && v.vote === 'Aye').length;
        const nays = votes.filter(v => v.motionId === motionId && v.vote === 'Nay').length;
        if (ayes > nays) return <Badge variant="default" className="bg-green-600">{t('passed')}</Badge>;
        if (nays > ayes) return <Badge variant="destructive">{t('failed')}</Badge>;
        return <Badge variant="secondary">{t('tied')}</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${mp.id}`} alt={mp.name} />
                        <AvatarFallback>{mp.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold">{mp.name}</h1>
                        <p className="text-muted-foreground">{t(mp.parliamentaryRoles as any)} {t('for')} {t(mp.location as any)}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {mp.keyPolicyInterests.split(', ').map(interest => (
                                <Badge key={interest} variant="secondary">{t(interest as any)}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
                 <EditProfileForm member={mp}>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" />{t('edit_profile')}</Button>
                </EditProfileForm>
            </div>

            {absences > ABSENCE_THRESHOLD && (
                 <Card className="border-destructive">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-destructive flex items-center text-lg"><AlertTriangle className="mr-2 h-5 w-5"/>{t('attendance_warning_title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{t('attendance_warning_subtitle')}</p>
                        <p className="text-xl font-bold">{t('absences')}: {absences}/{ABSENCE_THRESHOLD}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{t('profile_details_title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">{t('email')}:</span> {mp.email}</div>
                    <div><span className="font-semibold">{t('age')}:</span> {mp.age}</div>
                    <div><span className="font-semibold">{t('gender')}:</span> {t(mp.gender as any)}</div>
                    <div><span className="font-semibold">{t('education')}:</span> {t(mp.education as any)}</div>
                    <div><span className="font-semibold">{t('background')}:</span> {t(mp.professionalBackground as any)}</div>
                    <div className="col-span-2"><span className="font-semibold">{t('electoral_history')}:</span> {t(mp.electoralHistory as any)}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('sponsored_motions_title')}</CardTitle>
                    <CardDescription>{t('sponsored_motions_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('motion')}</TableHead>
                                <TableHead>{t('topic')}</TableHead>
                                <TableHead>{t('meeting')}</TableHead>
                                <TableHead>{t('outcome')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sponsoredMotions.length > 0 ? sponsoredMotions.map(motion => {
                                const meeting = meetings.find(m => m.motions.some(mo => mo.id === motion.id));
                                return (
                                    <TableRow key={motion.id}>
                                        <TableCell className="font-medium">{motion.title}</TableCell>
                                        <TableCell><Badge variant="outline">{t(motion.topic as any)}</Badge></TableCell>
                                        <TableCell>
                                            <Link href={`/meetings/manage/${meeting?.id}`} className="text-primary hover:underline">
                                                {meeting?.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{getVoteResult(motion.id)}</TableCell>
                                    </TableRow>
                                )
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">{t('no_sponsored_motions')}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>{t('voting_record_title')}</CardTitle>
                    <CardDescription>{t('voting_record_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('date')}</TableHead>
                                <TableHead>{t('meeting')}</TableHead>
                                <TableHead>{t('motion')}</TableHead>
                                <TableHead>{t('vote')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mpVotes.length > 0 ? mpVotes.map(vote => {
                                const meeting = meetings.find(m => m.motions.some(motion => motion.id === vote.motionId));
                                const motion = meeting?.motions.find(m => m.id === vote.motionId);
                                return (
                                    <TableRow key={vote.id}>
                                        <TableCell>{meeting?.date}</TableCell>
                                        <TableCell>
                                            <Link href={`/meetings/manage/${meeting?.id}`} className="text-primary hover:underline">
                                                {meeting?.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{motion?.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                vote.vote === 'Aye' ? 'default' :
                                                vote.vote === 'Nay' ? 'destructive' :
                                                vote.vote === 'Abstain' ? 'secondary' :
                                                'outline'
                                            }>{t(vote.vote as any)}</Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">{t('no_voting_records')}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className="text-center">
                 <Button asChild variant="outline">
                    <Link href="/parliament">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('back_to_parliament_list')}
                    </Link>
                </Button>
            </div>
        </div>
    );
}

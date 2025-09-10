'use client';

import * as React from 'react';
import { Member, Vote } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, AlertTriangle, FileUp } from "lucide-react";
import { EditProfileForm } from "./edit-profile-form";
import Link from "next/link";
import { getAllMeetings, getAllVotes } from "@/lib/supabase/queries";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useLanguage } from "@/hooks/use-language";
import { Meeting } from '@/lib/types';


export function MemberProfile({ member }: { member: Member }) {
    const { t } = useLanguage();
    const isMP = member.roles?.includes('isMP');
    const [votes, setVotes] = React.useState<Vote[]>([]);
    const [meetings, setMeetings] = React.useState<Meeting[]>([]);
    
    React.useEffect(() => {
        const fetchData = async () => {
            const [votesData, meetingsData] = await Promise.all([
                getAllVotes(),
                getAllMeetings()
            ]);
            setVotes(votesData);
            setMeetings(meetingsData);
        };
        fetchData();
    }, []);

    const status = member?.status || 'Active';

    const memberVotes = votes.filter(v => v.memberId === member.id);
    const absences = memberVotes.filter(v => v.vote === 'Absent');
    const leaves = memberVotes.filter(v => v.vote === 'Leave');

    const getMeetingFromVote = (vote: Vote) => {
        return meetings.find(m => m.motions.some(mo => mo.id === vote.motionId));
    }
    const ABSENCE_THRESHOLD = 3;

    return (
         <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold">{member.name}</h1>
                        <p className="text-muted-foreground">
                            {isMP ? t((member as Member).parliamentaryRoles as any) : t(member.professionalBackground as any)}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                             <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{t(status as any)}</Badge>
                             {member.roles?.includes('isMP') && <Badge variant="secondary">{t('member_of_parliament')}</Badge>}
                             {member.roles?.includes('isExec') && <Badge variant="destructive">{t('executive_committee')}</Badge>}
                        </div>
                    </div>
                </div>
                 <EditProfileForm member={member} />
            </div>
            
            {isMP && absences.length > ABSENCE_THRESHOLD && (
                 <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2"/>{t('attendance_warning_title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{t('attendance_warning_subtitle')}</p>
                        <p className="text-2xl font-bold">{t('absences')}: {absences.length}/{ABSENCE_THRESHOLD}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{t('contact_information')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-semibold">{t('email')}:</span> {member.email || 'N/A'}</div>
                    <div><span className="font-semibold">{t('location')}:</span> {t(member.location as any)}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('profile_details_title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">{t('age')}:</span> {member.age}</div>
                    <div><span className="font-semibold">{t('gender')}:</span> {t(member.gender as any)}</div>
                    <div><span className="font-semibold">{t('education')}:</span> {t(member.education as any)}</div>
                    <div><span className="font-semibold">{t('professional_background')}:</span> {t(member.professionalBackground as any)}</div>
                </CardContent>
            </Card>
            
            {!isMP && (
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('party_involvement_title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <h3 className="font-semibold mb-2">{t('committee_memberships')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {(member as Member).committeeMemberships.map(c => <Badge key={c} variant="outline">{t(c as any)}</Badge>)}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold">{t('activity_log')}</h3>
                            <p className="text-muted-foreground">{t((member as Member).activityLog as any)}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold">{t('volunteer_work')}</h3>
                            <p className="text-muted-foreground">{t((member as Member).volunteerWork as any, {hours: (member as Member).volunteerWork?.match(/\\d+/)?.[0] })}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isMP && (
                <>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('parliamentary_information_title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div><span className="font-semibold">{t('constituency')}:</span> {t(member.location as any)}</div>
                        <div><span className="font-semibold">{t('electoral_history')}:</span> {t((member as Member).electoralHistory as any)}</div>
                        <div><span className="font-semibold">{t('parliamentary_roles')}:</span> {t((member as Member).parliamentaryRoles as any)}</div>
                        <div>
                            <h3 className="font-semibold mb-2">{t('key_policy_interests')}</h3>
                             <div className="flex flex-wrap gap-2">
                                {(member as Member).keyPolicyInterests?.split(', ').map(interest => (
                                    <Badge key={interest} variant="secondary">{t(interest as any)}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>{t('attendance_record_title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">{t('meetings_on_leave')} ({leaves.length})</h3>
                        <div className="max-h-48 overflow-y-auto border rounded-md">
                            <Table>
                                <TableBody>
                                    {leaves.length > 0 ? leaves.map(vote => {
                                        const meeting = getMeetingFromVote(vote);
                                        return (
                                            <TableRow key={vote.id}>
                                                <TableCell>
                                                    <div className="font-medium">{meeting?.title}</div>
                                                    <div className="text-sm text-muted-foreground">{meeting?.date}</div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm"><FileUp className="mr-2 h-3 w-3"/> {t('upload_doc')}</Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }) : (
                                         <TableRow>
                                            <TableCell className="h-24 text-center">{t('no_leaves_recorded')}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">{t('meetings_absent')} ({absences.length})</h3>
                        <div className="max-h-48 overflow-y-auto border rounded-md">
                            <Table>
                                 <TableBody>
                                    {absences.length > 0 ? absences.map(vote => {
                                        const meeting = getMeetingFromVote(vote);
                                        return (
                                            <TableRow key={vote.id}>
                                                <TableCell>
                                                    <div className="font-medium">{meeting?.title}</div>
                                                    <div className="text-sm text-muted-foreground">{meeting?.date}</div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }) : (
                                         <TableRow>
                                            <TableCell className="h-24 text-center">{t('no_absences_recorded')}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

             {isMP && (
                <Card>
                    <CardHeader>
                         <CardTitle>{t('voting_record_title')}</CardTitle>
                        <CardDescription>{t('voting_record_subtitle')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('voting_record_placeholder_desc')} <Link href={`/parliament/${member.id}`} className="text-primary hover:underline">{t('view_full_record')}</Link></p>
                    </CardContent>
                </Card>
             )}
        </div>
    );
}

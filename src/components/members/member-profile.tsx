

import { Member, MP, Vote } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, AlertTriangle, FileUp } from "lucide-react";
import { EditProfileForm } from "./edit-profile-form";
import Link from "next/link";
import { allPartyMembers, votes, meetings } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";


export function MemberProfile({ member }: { member: Member | MP }) {
    const isMP = 'electoralHistory' in member;

    const fullMemberInfo = allPartyMembers.find(m => m.id === member.id);
    const status = fullMemberInfo?.status || 'Active';

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
                            {isMP ? (member as MP).parliamentaryRoles : member.professionalBackground}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                             <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>
                             {member.roles.includes('MP') && <Badge variant="secondary">Member of Parliament</Badge>}
                             {member.roles.includes('Executive') && <Badge variant="destructive">Executive Committee</Badge>}
                        </div>
                    </div>
                </div>
                 <EditProfileForm member={member} />
            </div>
            
            {isMP && absences.length > ABSENCE_THRESHOLD && (
                 <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2"/>Attendance Warning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This member has exceeded the absence threshold.</p>
                        <p className="text-2xl font-bold">Absences: {absences.length}/{ABSENCE_THRESHOLD}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-semibold">Email:</span> {member.email || 'N/A'}</div>
                    <div><span className="font-semibold">Location:</span> {member.location}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">Age:</span> {member.age}</div>
                    <div><span className="font-semibold">Gender:</span> {member.gender}</div>
                    <div><span className="font-semibold">Education:</span> {member.education}</div>
                    <div><span className="font-semibold">Professional Background:</span> {member.professionalBackground}</div>
                </CardContent>
            </Card>
            
            {!isMP && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Party Involvement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <h3 className="font-semibold mb-2">Committee Memberships</h3>
                            <div className="flex flex-wrap gap-2">
                                {(member as Member).committeeMemberships.map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold">Activity Log</h3>
                            <p className="text-muted-foreground">{(member as Member).activityLog}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold">Volunteer Work</h3>
                            <p className="text-muted-foreground">{(member as Member).volunteerWork}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isMP && (
                <>
                <Card>
                    <CardHeader>
                        <CardTitle>Parliamentary Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div><span className="font-semibold">Constituency:</span> {member.location}</div>
                        <div><span className="font-semibold">Electoral History:</span> {(member as MP).electoralHistory}</div>
                        <div><span className="font-semibold">Parliamentary Roles:</span> {(member as MP).parliamentaryRoles}</div>
                        <div>
                            <h3 className="font-semibold mb-2">Key Policy Interests</h3>
                             <div className="flex flex-wrap gap-2">
                                {(member as MP).keyPolicyInterests.split(', ').map(interest => (
                                    <Badge key={interest} variant="secondary">{interest}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Record</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Meetings on Leave ({leaves.length})</h3>
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
                                                    <Button variant="outline" size="sm"><FileUp className="mr-2 h-3 w-3"/> Upload Doc</Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }) : (
                                         <TableRow>
                                            <TableCell className="h-24 text-center">No leaves recorded.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Meetings Absent ({absences.length})</h3>
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
                                            <TableCell className="h-24 text-center">No absences recorded.</TableCell>
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
                         <CardTitle>Voting Record</CardTitle>
                        <CardDescription>A log of all recorded votes on parliamentary and party motions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Detailed voting record will be displayed here. <Link href={`/parliament/${member.id}`} className="text-primary hover:underline">View Full Record</Link></p>
                    </CardContent>
                </Card>
             )}
        </div>
    );
}

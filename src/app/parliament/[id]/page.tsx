

import { meetings, mps, votes } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, MinusCircle, UserX, XCircle, AlertTriangle } from "lucide-react";

export default function MPProfilePage({ params }: { params: { id: string } }) {
    const mp = mps.find(m => m.id === params.id);

    if (!mp) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Member of Parliament not found</h1>
                <p className="text-muted-foreground">The requested MP could not be located.</p>
                <Button asChild className="mt-4">
                    <Link href="/parliament">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Parliament List
                    </Link>
                </Button>
            </div>
        )
    }

    const mpVotes = votes.filter(vote => vote.memberId === mp.id);
    const sponsoredMotions = meetings.flatMap(m => m.motions).filter(motion => motion.sponsorId === mp.id);
    const absences = mpVotes.filter(v => v.vote === 'Absent').length;
    const ABSENCE_THRESHOLD = 3;

    const getVoteResult = (motionId: string) => {
        const ayes = votes.filter(v => v.motionId === motionId && v.vote === 'Aye').length;
        const nays = votes.filter(v => v.motionId === motionId && v.vote === 'Nay').length;
        if (ayes > nays) return <Badge variant="default" className="bg-green-600">Passed</Badge>;
        if (nays > ayes) return <Badge variant="destructive">Failed</Badge>;
        return <Badge variant="secondary">Tied</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${mp.id}`} alt={mp.name} />
                    <AvatarFallback>{mp.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">{mp.name}</h1>
                    <p className="text-muted-foreground">{mp.parliamentaryRoles} for {mp.location}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {mp.keyPolicyInterests.split(', ').map(interest => (
                            <Badge key={interest} variant="secondary">{interest}</Badge>
                        ))}
                    </div>
                </div>
            </div>

            {absences > ABSENCE_THRESHOLD && (
                 <Card className="border-destructive">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-destructive flex items-center text-lg"><AlertTriangle className="mr-2 h-5 w-5"/>Attendance Warning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This member has exceeded the absence threshold.</p>
                        <p className="text-xl font-bold">Absences: {absences}/{ABSENCE_THRESHOLD}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">Email:</span> {mp.email}</div>
                    <div><span className="font-semibold">Age:</span> {mp.age}</div>
                    <div><span className="font-semibold">Gender:</span> {mp.gender}</div>
                    <div><span className="font-semibold">Education:</span> {mp.education}</div>
                    <div><span className="font-semibold">Background:</span> {mp.professionalBackground}</div>
                    <div className="col-span-2"><span className="font-semibold">Electoral History:</span> {mp.electoralHistory}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sponsored Motions</CardTitle>
                    <CardDescription>Motions this member has sponsored.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Motion</TableHead>
                                <TableHead>Topic</TableHead>
                                <TableHead>Meeting</TableHead>
                                <TableHead>Outcome</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sponsoredMotions.length > 0 ? sponsoredMotions.map(motion => {
                                const meeting = meetings.find(m => m.motions.some(mo => mo.id === motion.id));
                                return (
                                    <TableRow key={motion.id}>
                                        <TableCell className="font-medium">{motion.title}</TableCell>
                                        <TableCell><Badge variant="outline">{motion.topic}</Badge></TableCell>
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
                                    <TableCell colSpan={4} className="text-center">No sponsored motions found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Voting Record</CardTitle>
                    <CardDescription>A log of all recorded votes on parliamentary and party motions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Meeting</TableHead>
                                <TableHead>Motion</TableHead>
                                <TableHead>Vote</TableHead>
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
                                            }>{vote.vote}</Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No voting records found.</TableCell>
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
                        Back to Parliament List
                    </Link>
                </Button>
            </div>
        </div>
    );
}

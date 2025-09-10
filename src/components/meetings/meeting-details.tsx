
'use client'

import { mps, votes as allVotes, allPartyMembers as allMembers, meetings } from "@/lib/data"
import { Meeting, Vote, Motion } from "@/lib/types"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, FileText, Trash2, User, VoteIcon, CheckCircle2, XCircle, MinusCircle, UserX, UserCheck, Landmark } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditMeetingForm } from "./edit-meeting-form"
import { RecordVotesForm } from "./record-votes-form"

export function MeetingDetails({ meeting }: { meeting: Meeting }) {
    const getMemberName = (memberId: string) => {
        const member = allMembers.find(m => m.id === memberId)
        return member?.name || "Unknown Member";
    };

    const getVoteForMotion = (motionId: string, memberId: string): Vote | undefined => {
        return allVotes.find(v => v.motionId === motionId && v.memberId === memberId);
    }
    
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{meeting.title}</h1>
                    <p className="text-muted-foreground">Meeting held on {meeting.date}</p>
                </div>
                 <div className="flex gap-2">
                     <EditMeetingForm meeting={meeting}>
                        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Meeting</Button>
                    </EditMeetingForm>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this meeting and all associated voting records.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Meeting Information</CardTitle>
                </CardHeader>
                 <CardContent className="grid md:grid-cols-2 gap-4">
                     <div>
                        <h3 className="font-semibold mb-2 flex items-center"><User className="mr-2 h-4 w-4" />Attendees</h3>
                        <div className="flex flex-wrap gap-2">
                            {meeting.attendees.map(id => <Badge key={id} variant="secondary">{getMemberName(id)}</Badge>)}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Presiding Officer</h3>
                        <Badge variant="outline">{meeting.presidingOfficer}</Badge>
                    </div>
                     {meeting.relatedDocuments && meeting.relatedDocuments.length > 0 && (
                        <div className="col-span-full">
                            <h3 className="font-semibold mb-2 flex items-center"><FileText className="mr-2 h-4 w-4" />Related Documents</h3>
                            <div className="flex flex-wrap gap-2">
                                {meeting.relatedDocuments.map((doc, i) => (
                                    <Button variant="link" asChild key={i} className="p-0 h-auto">
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Agenda & Voting</CardTitle>
                    <CardDescription>Motions discussed and their voting outcomes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {meeting.motions.map((motion, index) => {
                        const partyAye = allVotes.filter(v => v.motionId === motion.id && v.vote === 'Aye').length;
                        const partyNay = allVotes.filter(v => v.motionId === motion.id && v.vote === 'Nay').length;
                        const partyAbstain = allVotes.filter(v => v.motionId === motion.id && v.vote === 'Abstain').length;
                        const partyLeave = allVotes.filter(v => v.motionId === motion.id && v.vote === 'Leave').length;
                        const partyAbsent = meeting.attendees.length - (partyAye + partyNay + partyAbstain + partyLeave);
                        
                        const otherAye = (motion.totalParliamentAye ?? 0) - partyAye;
                        const otherNay = (motion.totalParliamentNay ?? 0) - partyNay;
                        const otherAbstain = (motion.totalParliamentAbstain ?? 0) - partyAbstain;

                        
                        return (
                        <div key={motion.id} className="border rounded-lg p-4">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">Motion {index + 1}: {motion.title}</h3>
                                    <div className="text-sm text-muted-foreground">Topic: <Badge variant="outline" className="ml-1">{motion.topic}</Badge></div>
                                    {motion.sponsorId && (
                                        <div className="text-sm text-muted-foreground mt-1">Sponsor: <Badge variant="secondary" className="ml-1">{getMemberName(motion.sponsorId)}</Badge></div>
                                    )}
                                </div>
                                {motion.isPartySponsored && <Badge>Party-Sponsored</Badge>}
                            </div>
                            <p className="text-muted-foreground mb-4">{motion.description}</p>
                            
                             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-center">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 flex flex-col items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyAye}</div>
                                    <div className="text-sm text-green-700 dark:text-green-300">Party Aye</div>
                                </div>
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 flex flex-col items-center justify-center">
                                     <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyNay}</div>
                                    <div className="text-sm text-red-700 dark:text-red-300">Party Nay</div>
                                </div>
                                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex flex-col items-center justify-center">
                                    <MinusCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyAbstain}</div>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Abstain</div>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex flex-col items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyLeave}</div>
                                    <div className="text-sm text-blue-700 dark:text-blue-300">On Leave</div>
                                </div>
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex flex-col items-center justify-center">
                                    <UserX className="h-6 w-6 text-gray-500 dark:text-gray-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyAbsent}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-300">Absent</div>
                                </div>
                            </div>
                            
                            {meeting.meetingType === 'การประชุมสภา' && (motion.totalParliamentAye !== undefined && motion.totalParliamentNay !== undefined) && (
                                <Card className="mb-4">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg flex items-center"><Landmark className="mr-2 h-5 w-5" />Parliamentary Vote Outcome</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead></TableHead>
                                                    <TableHead className="text-center">Aye</TableHead>
                                                    <TableHead className="text-center">Nay</TableHead>
                                                    <TableHead className="text-center">Abstain</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">Our Party</TableCell>
                                                    <TableCell className="text-center font-semibold text-green-600">{partyAye}</TableCell>
                                                    <TableCell className="text-center font-semibold text-red-600">{partyNay}</TableCell>
                                                    <TableCell className="text-center font-semibold text-yellow-600">{partyAbstain}</TableCell>
                                                </TableRow>
                                                 <TableRow>
                                                    <TableCell className="font-medium">Other Parties</TableCell>
                                                    <TableCell className="text-center font-semibold">{otherAye}</TableCell>
                                                    <TableCell className="text-center font-semibold">{otherNay}</TableCell>
                                                    <TableCell className="text-center font-semibold">{otherAbstain}</TableCell>
                                                </TableRow>
                                                <TableRow className="bg-muted/50">
                                                    <TableCell className="font-bold">Total Parliament</TableCell>
                                                    <TableCell className="text-center font-bold">{motion.totalParliamentAye}</TableCell>
                                                    <TableCell className="text-center font-bold">{motion.totalParliamentNay}</TableCell>
                                                    <TableCell className="text-center font-bold">{motion.totalParliamentAbstain}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}

                            <h4 className="font-semibold mb-2">Party Individual Votes</h4>
                            <div className="max-h-60 overflow-y-auto border rounded-md">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-muted/50">
                                        <TableRow>
                                            <TableHead>Member</TableHead>
                                            <TableHead>Vote</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {meeting.attendees.map(attendeeId => {
                                            const vote = getVoteForMotion(motion.id, attendeeId);
                                            return (
                                                <TableRow key={attendeeId}>
                                                    <TableCell>{getMemberName(attendeeId)}</TableCell>
                                                    <TableCell>
                                                        {vote ? (
                                                             <Badge variant={
                                                                vote.vote === 'Aye' ? 'default' :
                                                                vote.vote === 'Nay' ? 'destructive' :
                                                                vote.vote === 'Abstain' ? 'secondary' :
                                                                vote.vote === 'Leave' ? 'outline' :
                                                                'outline'
                                                            }>{vote.vote}</Badge>
                                                        ) : (
                                                            <Badge variant="outline">Not Voted</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex justify-end mt-4">
                                <RecordVotesForm meeting={meeting} motion={motion}>
                                    <Button><VoteIcon className="mr-2 h-4 w-4" /> Record / Edit Votes</Button>
                                </RecordVotesForm>
                            </div>
                        </div>
                    )})}
                </CardContent>
            </Card>

             <div className="text-center">
                 <Button asChild variant="outline">
                    <Link href="/meetings/manage">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Meetings List
                    </Link>
                </Button>
            </div>
        </div>
    )
}

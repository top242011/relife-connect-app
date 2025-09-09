
'use client'

import { mps, votes as allVotes, members as allMembers } from "@/lib/data"
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
import { ArrowLeft, Edit, FileText, Trash2, User, VoteIcon, CheckCircle2, XCircle, MinusCircle, UserX } from "lucide-react"
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
        const member = allMembers.find(m => m.id === memberId) || mps.find(m => m.id === memberId);
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
                        <Badge variant="outline">{getMemberName(meeting.presidingOfficer)}</Badge>
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
                    {meeting.motions.map((motion, index) => (
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
                            
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 flex flex-col items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                                    <div className="text-2xl font-bold">{allVotes.filter(v => v.motionId === motion.id && v.vote === 'Aye').length}</div>
                                    <div className="text-sm text-green-700 dark:text-green-300">Aye</div>
                                </div>
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 flex flex-col items-center justify-center">
                                     <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mb-1" />
                                    <div className="text-2xl font-bold">{allVotes.filter(v => v.motionId === motion.id && v.vote === 'Nay').length}</div>
                                    <div className="text-sm text-red-700 dark:text-red-300">Nay</div>
                                </div>
                                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex flex-col items-center justify-center">
                                    <MinusCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-1" />
                                    <div className="text-2xl font-bold">{allVotes.filter(v => v.motionId === motion.id && v.vote === 'Abstain').length}</div>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Abstain</div>
                                </div>
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex flex-col items-center justify-center">
                                    <UserX className="h-6 w-6 text-gray-500 dark:text-gray-400 mb-1" />
                                    <div className="text-2xl font-bold">{meeting.attendees.length - allVotes.filter(v => v.motionId === motion.id && ['Aye', 'Nay', 'Abstain'].includes(v.vote)).length}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-300">Not Voted</div>
                                </div>
                            </div>
                            
                            <h4 className="font-semibold mb-2">Individual Votes</h4>
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
                    ))}
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

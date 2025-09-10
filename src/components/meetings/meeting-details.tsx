'use client'

import { Meeting, Vote } from "@/lib/types"
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
import { useLanguage } from "@/hooks/use-language"
import * as React from "react"
import { getAllMembers, getAllVotes } from "@/lib/supabase/queries"
import { Member } from "@/lib/types"

export function MeetingDetails({ meeting }: { meeting: Meeting }) {
    const { t } = useLanguage();
    const [allMembers, setAllMembers] = React.useState<Member[]>([]);
    const [allVotes, setAllVotes] = React.useState<Vote[]>([]);
    
    React.useEffect(() => {
        const fetchData = async () => {
            const [membersData, votesData] = await Promise.all([getAllMembers(), getAllVotes()]);
            setAllMembers(membersData);
            setAllVotes(votesData);
        };
        fetchData();
    }, []);

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
                    <p className="text-muted-foreground">{t('meeting_held_on')} {meeting.date}</p>
                </div>
                 <div className="flex gap-2">
                     <EditMeetingForm meeting={meeting}>
                        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> {t('edit_meeting')}</Button>
                    </EditMeetingForm>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> {t('delete')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('are_you_sure')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('delete_meeting_confirmation')}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction>{t('continue')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('meeting_information')}</CardTitle>
                </CardHeader>
                 <CardContent className="grid md:grid-cols-2 gap-4">
                     <div>
                        <h3 className="font-semibold mb-2 flex items-center"><User className="mr-2 h-4 w-4" />{t('attendees')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {meeting.attendees.map(id => <Badge key={id} variant="secondary">{getMemberName(id)}</Badge>)}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">{t('presiding_officer')}</h3>
                        <Badge variant="outline">{meeting.presidingOfficer}</Badge>
                    </div>
                     {meeting.relatedDocuments && meeting.relatedDocuments.length > 0 && (
                        <div className="col-span-full">
                            <h3 className="font-semibold mb-2 flex items-center"><FileText className="mr-2 h-4 w-4" />{t('related_documents')}</h3>
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
                    <CardTitle>{t('agenda_and_voting')}</CardTitle>
                    <CardDescription>{t('agenda_and_voting_subtitle')}</CardDescription>
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
                                    <h3 className="font-bold text-lg">{t('motion')} {index + 1}: {motion.title}</h3>
                                    <div className="text-sm text-muted-foreground">{t('topic')}: <Badge variant="outline" className="ml-1">{t(motion.topic as any)}</Badge></div>
                                    {motion.sponsorId && (
                                        <div className="text-sm text-muted-foreground mt-1">{t('sponsor')}: <Badge variant="secondary" className="ml-1">{getMemberName(motion.sponsorId)}</Badge></div>
                                    )}
                                </div>
                                {motion.isPartySponsored && <Badge>{t('party_sponsored_motion')}</Badge>}
                            </div>
                            <p className="text-muted-foreground mb-4">{motion.description}</p>
                            
                             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-center">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 flex flex-col items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyAye}</div>
                                    <div className="text-sm text-green-700 dark:text-green-300">{t('party_aye')}</div>
                                </div>
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 flex flex-col items-center justify-center">
                                     <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyNay}</div>
                                    <div className="text-sm text-red-700 dark:text-red-300">{t('party_nay')}</div>
                                </div>
                                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex flex-col items-center justify-center">
                                    <MinusCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyAbstain}</div>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-300">{t('abstain')}</div>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex flex-col items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyLeave}</div>
                                    <div className="text-sm text-blue-700 dark:text-blue-300">{t('on_leave')}</div>
                                </div>
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex flex-col items-center justify-center">
                                    <UserX className="h-6 w-6 text-gray-500 dark:text-gray-400 mb-1" />
                                    <div className="text-2xl font-bold">{partyAbsent}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-300">{t('absent')}</div>
                                </div>
                            </div>
                            
                            {meeting.meetingType === 'การประชุมสภา' && (motion.totalParliamentAye !== undefined && motion.totalParliamentNay !== undefined) && (
                                <Card className="mb-4">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg flex items-center"><Landmark className="mr-2 h-5 w-5" />{t('parliamentary_vote_outcome')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead></TableHead>
                                                    <TableHead className="text-center">{t('aye')}</TableHead>
                                                    <TableHead className="text-center">{t('nay')}</TableHead>
                                                    <TableHead className="text-center">{t('abstain')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">{t('our_party')}</TableCell>
                                                    <TableCell className="text-center font-semibold text-green-600">{partyAye}</TableCell>
                                                    <TableCell className="text-center font-semibold text-red-600">{partyNay}</TableCell>
                                                    <TableCell className="text-center font-semibold text-yellow-600">{partyAbstain}</TableCell>
                                                </TableRow>
                                                 <TableRow>
                                                    <TableCell className="font-medium">{t('other_parties')}</TableCell>
                                                    <TableCell className="text-center font-semibold">{otherAye}</TableCell>
                                                    <TableCell className="text-center font-semibold">{otherNay}</TableCell>
                                                    <TableCell className="text-center font-semibold">{otherAbstain}</TableCell>
                                                </TableRow>
                                                <TableRow className="bg-muted/50">
                                                    <TableCell className="font-bold">{t('total_parliament')}</TableCell>
                                                    <TableCell className="text-center font-bold">{motion.totalParliamentAye}</TableCell>
                                                    <TableCell className="text-center font-bold">{motion.totalParliamentNay}</TableCell>
                                                    <TableCell className="text-center font-bold">{motion.totalParliamentAbstain}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}

                            <h4 className="font-semibold mb-2">{t('party_individual_votes')}</h4>
                            <div className="max-h-60 overflow-y-auto border rounded-md">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-muted/50">
                                        <TableRow>
                                            <TableHead>{t('member')}</TableHead>
                                            <TableHead>{t('vote')}</TableHead>
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
                                                            }>{t(vote.vote as any)}</Badge>
                                                        ) : (
                                                            <Badge variant="outline">{t('not_voted')}</Badge>
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
                                    <Button><VoteIcon className="mr-2 h-4 w-4" /> {t('record_edit_votes')}</Button>
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
                        {t('back_to_meetings_list')}
                    </Link>
                </Button>
            </div>
        </div>
    )
}

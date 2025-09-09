'use client';

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Meeting, Motion, Vote, VoteType } from '@/lib/types';
import { members as allMembers, mps as allMps, votes as allVotesData } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, AlertTriangle, Wand2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const voteSchema = z.object({
  memberId: z.string(),
  vote: z.enum(['Aye', 'Nay', 'Abstain', 'Absent']),
});

const formSchema = z.object({
  votes: z.array(voteSchema),
});

type VoteFormValues = z.infer<typeof formSchema>;

const allPartyMembers = [...allMembers, ...allMps];

const getMemberName = (memberId: string) => {
    return allPartyMembers.find((m) => m.id === memberId)?.name || 'Unknown Member';
};


export function RecordVotesForm({ meeting, motion, children }: { meeting: Meeting; motion: Motion, children: React.ReactNode }) {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [bulkVote, setBulkVote] = React.useState<VoteType | ''>('');


  const defaultValues: VoteFormValues = {
    votes: meeting.attendees.map((attendeeId) => {
      const existingVote = allVotesData.find(
        (v) => v.motionId === motion.id && v.memberId === attendeeId
      );
      return {
        memberId: attendeeId,
        vote: existingVote ? existingVote.vote : 'Absent',
      };
    }),
  };

  const form = useForm<VoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, update } = useFieldArray({
    control: form.control,
    name: 'votes',
  });

  const onSubmit = (data: VoteFormValues) => {
    data.votes.forEach((voteData) => {
      const existingVoteIndex = allVotesData.findIndex(
        (v) => v.motionId === motion.id && v.memberId === voteData.memberId
      );

      if (existingVoteIndex !== -1) {
        allVotesData[existingVoteIndex].vote = voteData.vote;
      } else {
        allVotesData.push({
          id: `vote-${Date.now()}-${Math.random()}`,
          motionId: motion.id,
          memberId: voteData.memberId,
          vote: voteData.vote,
        });
      }
    });

    toast({
        title: "Votes Saved",
        description: `Voting records for "${motion.title}" have been updated.`,
    });
    setDialogOpen(false);
  };
  
  const handleBulkVote = () => {
    if (!bulkVote) return;
    fields.forEach((field, index) => {
        update(index, { ...field, vote: bulkVote });
    });
    toast({
        title: "Bulk Vote Applied",
        description: `All votes have been set to "${bulkVote}". You can make individual changes before saving.`,
    });
  }

  const handleReset = () => {
    form.reset(defaultValues);
    toast({
        title: "Form Reset",
        description: `Voting records have been reset to their last saved state.`,
    })
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Record Votes: {motion.title}</DialogTitle>
          <DialogDescription>
            Record or update the vote for each attendee for this motion.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col min-h-0">
             <Card>
                <CardHeader className='pb-2'>
                    <CardTitle className="text-lg flex items-center"><Wand2 className="mr-2" />Bulk Edit</CardTitle>
                    <CardDescription>Quickly set the vote for all attendees.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                     <Select value={bulkVote} onValueChange={(value) => setBulkVote(value as VoteType | '')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a vote outcome..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aye">Aye</SelectItem>
                            <SelectItem value="Nay">Nay</SelectItem>
                            <SelectItem value="Abstain">Abstain</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                        </SelectContent>
                    </Select>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button type="button" variant="secondary" disabled={!bulkVote}>Apply to All</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className='flex items-center'><AlertTriangle className="mr-2 h-5 w-5 text-destructive" />Confirm Bulk Update</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to set the vote for all {fields.length} attendees to "{bulkVote}"? This will overwrite any existing individual votes on this form.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleBulkVote}>Confirm & Apply</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

            <div className="flex-1 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50">
                  <TableRow>
                    <TableHead>Attendee</TableHead>
                    <TableHead className="w-[150px]">Vote</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{getMemberName(field.memberId)}</TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`votes.${index}.vote`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                 <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vote" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Aye">Aye</SelectItem>
                                        <SelectItem value="Nay">Nay</SelectItem>
                                        <SelectItem value="Abstain">Abstain</SelectItem>
                                        <SelectItem value="Absent">Absent</SelectItem>
                                    </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleReset}><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save Votes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Meeting, Motion, Vote, VoteType } from '@/lib/types';
import { members as allMembers, mps as allMps, votes as allVotesData, meetings } from '@/lib/data';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, AlertTriangle, Wand2, RefreshCw, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { useLanguage } from '@/hooks/use-language';

const voteSchema = z.object({
  memberId: z.string(),
  vote: z.enum(['Aye', 'Nay', 'Abstain', 'Absent', 'Leave']),
});

const formSchema = z.object({
  votes: z.array(voteSchema),
  totalParliamentAye: z.coerce.number().optional(),
  totalParliamentNay: z.coerce.number().optional(),
  totalParliamentAbstain: z.coerce.number().optional(),
});

type VoteFormValues = z.infer<typeof formSchema>;

const allPartyMembers = [...allMembers, ...allMps];

const getMemberName = (memberId: string) => {
    return allPartyMembers.find((m) => m.id === memberId)?.name || 'Unknown Member';
};


export function RecordVotesForm({ meeting, motion, children }: { meeting: Meeting; motion: Motion, children: React.ReactNode }) {
    const { toast } = useToast();
    const { t } = useLanguage();
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
    totalParliamentAye: motion.totalParliamentAye,
    totalParliamentNay: motion.totalParliamentNay,
    totalParliamentAbstain: motion.totalParliamentAbstain,
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
    // Update individual party votes
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

    const meetingToUpdate = meetings.find(m => m.id === meeting.id);
    if (meetingToUpdate) {
        const motionToUpdate = meetingToUpdate.motions.find(m => m.id === motion.id);
        if (motionToUpdate) {
            motionToUpdate.totalParliamentAye = data.totalParliamentAye;
            motionToUpdate.totalParliamentNay = data.totalParliamentNay;
            motionToUpdate.totalParliamentAbstain = data.totalParliamentAbstain;
        }
    }


    toast({
        title: t('toast_votes_saved_title'),
        description: t('toast_votes_saved_desc', { motionTitle: motion.title }),
    });
    setDialogOpen(false);
  };
  
  const handleBulkVote = () => {
    if (!bulkVote) return;
    fields.forEach((field, index) => {
        update(index, { ...field, vote: bulkVote });
    });
    toast({
        title: t('toast_bulk_vote_title'),
        description: t('toast_bulk_vote_desc', { vote: t(bulkVote as any) }),
    });
  }

  const handleReset = () => {
    form.reset(defaultValues);
    toast({
        title: t('toast_form_reset_title'),
        description: t('toast_form_reset_desc'),
    })
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('record_votes_title')}: {motion.title}</DialogTitle>
          <DialogDescription>
            {t('record_votes_subtitle')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col min-h-0">
             <Card>
                <CardHeader className='pb-2'>
                    <CardTitle className="text-lg flex items-center"><Wand2 className="mr-2" />{t('bulk_edit_party_votes_title')}</CardTitle>
                    <CardDescription>{t('bulk_edit_party_votes_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                     <Select value={bulkVote} onValueChange={(value) => setBulkVote(value as VoteType | '')}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('select_vote_outcome')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aye">{t('aye')}</SelectItem>
                            <SelectItem value="Nay">{t('nay')}</SelectItem>
                            <SelectItem value="Abstain">{t('abstain')}</SelectItem>
                            <SelectItem value="Absent">{t('absent')}</SelectItem>
                            <SelectItem value="Leave">{t('on_leave')}</SelectItem>
                        </SelectContent>
                    </Select>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button type="button" variant="secondary" disabled={!bulkVote}>{t('apply_to_all')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className='flex items-center'><AlertTriangle className="mr-2 h-5 w-5 text-destructive" />{t('confirm_bulk_update_title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('confirm_bulk_update_desc', { count: fields.length, vote: t(bulkVote as any) })}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleBulkVote}>{t('confirm_apply')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

            {meeting.meetingType === 'การประชุมสภา' && (
                <Card>
                     <CardHeader className='pb-2'>
                        <CardTitle className="text-lg flex items-center"><Landmark className="mr-2" />{t('parliamentary_vote_totals_title')}</CardTitle>
                        <CardDescription>{t('parliamentary_vote_totals_subtitle')}</CardDescription>
                    </CardHeader>
                    <CardContent className='grid grid-cols-3 gap-4'>
                        <FormField
                            control={form.control}
                            name="totalParliamentAye"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t('total_aye_votes')}</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 150" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="totalParliamentNay"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t('total_nay_votes')}</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 100" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="totalParliamentAbstain"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{t('total_abstain_votes')}</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 10" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            )}

            <div className="flex-1 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50">
                  <TableRow>
                    <TableHead>{t('attendee')}</TableHead>
                    <TableHead className="w-[150px]">{t('vote')}</TableHead>
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
                                        <SelectValue placeholder={t('select_vote')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Aye">{t('aye')}</SelectItem>
                                        <SelectItem value="Nay">{t('nay')}</SelectItem>
                                        <SelectItem value="Abstain">{t('abstain')}</SelectItem>
                                        <SelectItem value="Absent">{t('absent')}</SelectItem>
                                        <SelectItem value="Leave">{t('on_leave')}</SelectItem>
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
              <Button type="button" variant="ghost" onClick={handleReset}><RefreshCw className="mr-2 h-4 w-4" /> {t('reset')}</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">{t('cancel')}</Button>
              </DialogClose>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> {t('save_votes')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client'

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { Meeting, Member } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Save, PlusCircle, Trash2, Users } from "lucide-react";
import { getAllMembers, getCommitteeNames, getMotionTopics, getLocations, updateMeeting } from "@/lib/supabase/queries";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Location } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";

const motionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Motion title is required"),
    description: z.string().min(1, "Motion description is required"),
    isPartyProposed: z.boolean().default(false),
    topic: z.string().min(1, "Topic is required"),
    proposerId: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  date: z.string().min(1, "Date is required"),
  presidingOfficer: z.string().min(1, "Presiding officer is required"),
  attendees: z.array(z.string()),
  motions: z.array(motionSchema).min(1, "At least one motion is required"),
  location: z.any({ required_error: "Location is required" }),
  meetingType: z.enum(["การประชุมสภา", "การประชุมพรรค", "การประชุมกรรมาธิการ"], { required_error: "Meeting type is required" }),
  meetingSession: z.enum(["การประชุมสามัญ", "การประชุมวิสามัญ"], { required_error: "Meeting session is required" }),
  meetingNumber: z.string().optional(),
  committeeName: z.string().optional(),
}).refine(data => {
    for (const motion of data.motions) {
        if (motion.isPartyProposed && !motion.proposerId) {
            return false;
        }
    }
    return true;
}, {
    message: "A party-proposed motion must have a proposing member.",
    path: ["motions"],
}).refine(data => {
    if (data.meetingType === 'การประชุมกรรมาธิการ' && !data.committeeName) {
        return false;
    }
    return true;
}, {
    message: "Committee Name is required for Committee Meetings.",
    path: ["committeeName"],
});


type MeetingFormValues = z.infer<typeof formSchema>;

export function EditMeetingForm({ meeting, children }: { meeting: Meeting, children: React.ReactNode }) {
    const { toast } = useToast();
    const router = useRouter();
    const { t } = useLanguage();
    const [open, setOpen] = React.useState(false);
    const [allMembers, setAllMembers] = React.useState<Member[]>([]);
    const [motionTopics, setMotionTopics] = React.useState<string[]>([]);
    const [committeeNames, setCommitteeNames] = React.useState<string[]>([]);
    const [locations, setLocations] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!open) return;
        const fetchData = async () => {
            const [membersData, topicsData, committeesData, locationsData] = await Promise.all([
                getAllMembers(),
                getMotionTopics(),
                getCommitteeNames(),
                getLocations(),
            ]);
            setAllMembers(membersData);
            setMotionTopics(topicsData);
            setCommitteeNames(committeesData);
            setLocations(locationsData);
        };
        fetchData();
    }, [open]);

  const defaultValues: Partial<MeetingFormValues> = {
    title: meeting.title,
    date: meeting.date,
    presidingOfficer: meeting.presidingOfficer,
    attendees: meeting.attendees,
    motions: meeting.motions,
    location: meeting.location,
    meetingType: meeting.meetingType,
    meetingSession: meeting.meetingSession,
    meetingNumber: meeting.meetingNumber,
    committeeName: meeting.committeeName,
  };

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
    if (open) {
        form.reset(defaultValues);
    }
  }, [open, meeting, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "motions"
  });

  const meetingType = form.watch('meetingType');
  const committeeName = form.watch('committeeName');
  const location = form.watch('location');

  const availableAttendees = React.useMemo(() => {
    if (meetingType === 'การประชุมสภา') {
        const mps = allMembers.filter(m => m.roles.includes('isCouncilMember'));
        if (location && location !== 'ส่วนกลาง') {
            return mps.filter(m => m.location === location);
        }
        return mps; // For 'ส่วนกลาง' or if location is not set yet
    }
    if (meetingType === 'การประชุมกรรมาธิการ' && committeeName) {
      return allMembers.filter(m => m.committeeMemberships?.includes(committeeName));
    }
    return allMembers;
  }, [meetingType, committeeName, location, allMembers]);


  const onSubmit = async (data: MeetingFormValues) => {
    try {
        await updateMeeting(meeting.id, data);
        toast({
            title: t("toast_meeting_updated_title"),
            description: t("toast_meeting_updated_desc"),
        });
        setOpen(false);
        router.refresh();
    } catch (error) {
        toast({
            title: t("toast_update_failed_title"),
            description: t("toast_update_failed_desc"),
            variant: "destructive",
        });
        console.error("Failed to update meeting:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('edit_meeting_title')}: {meeting.title}</DialogTitle>
          <DialogDescription>
            {t('edit_meeting_subtitle')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1 py-4">
            
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>{t('meeting_title')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem><FormLabel>{t('date')}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField
                    name="presidingOfficer"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>{t('presiding_officer')}</FormLabel>
                             <Combobox
                                options={allMembers.map(m => ({ value: m.name, label: m.name }))}
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder={t('select_or_type_officer')}
                            />
                             <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
             <FormField control={form.control} name="meetingNumber" render={({ field }) => (
                <FormItem><FormLabel>{t('meeting_number')}</FormLabel><FormControl><Input {...field} placeholder="e.g., 1/2567" /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>{t('location')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('select_location')} /></SelectTrigger></FormControl><SelectContent>{locations.map(loc => (<SelectItem key={loc} value={loc}>{t(loc as any)}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="meetingType" render={({ field }) => (
                    <FormItem><FormLabel>{t('meeting_type')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('select_type')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="การประชุมสภา">{t('meeting_type_parliament')}</SelectItem><SelectItem value="การประชุมพรรค">{t('meeting_type_party')}</SelectItem><SelectItem value="การประชุมกรรมาธิการ">{t('meeting_type_committee')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="meetingSession" render={({ field }) => (
                    <FormItem><FormLabel>{t('meeting_session')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('select_session')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="การประชุมสามัญ">{t('session_ordinary')}</SelectItem><SelectItem value="การประชุมวิสามัญ">{t('session_extraordinary')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
            </div>
            {meetingType === 'การประชุมกรรมาธิการ' && (
                <FormField control={form.control} name="committeeName" render={({ field }) => (
                    <FormItem><FormLabel>{t('committee_name')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('select_committee')} /></SelectTrigger></FormControl><SelectContent>{committeeNames.map(name => (<SelectItem key={name} value={name}>{t(name as any)}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )}/>
            )}
             <FormField
                name="attendees"
                control={form.control}
                render={({ field }) => (
                     <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>{t('attendees')}</FormLabel>
                            <Select onValueChange={(val) => {
                                if (val === 'all') field.onChange(availableAttendees.map(m => m.id))
                                else if (val === 'none') field.onChange([])
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t('quick_select_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('quick_select_all_attend')}</SelectItem>
                                    <SelectItem value="none">{t('quick_select_all_absent')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <MultiSelect options={availableAttendees.map(m => ({value: m.id, label: m.name}))} {...field} />
                         <FormMessage />
                    </FormItem>
                )}
                />

             <div>
                <h3 className="text-lg font-medium mb-2">{t('agenda_motions')}</h3>
                <div className="space-y-4">
                {fields.map((motion, index) => {
                    const availableTopics = motionTopics.includes(motion.topic) ? motionTopics : [motion.topic, ...motionTopics];
                    return (
                    <div key={motion.id} className="rounded-md border p-4 space-y-4 relative">
                         <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                         <FormField
                            control={form.control}
                            name={`motions.${index}.title`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('motion_title')}</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`motions.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('motion_description')}</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name={`motions.${index}.topic`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('topic')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('select_a_topic')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableTopics.map(topic => (
                                                    <SelectItem key={topic} value={topic}>{t(topic as any)}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name={`motions.${index}.proposerId`}
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t('proposing_member')}</FormLabel>
                                        <MultiSelect a-type="single" options={allMembers.filter(m => m.roles?.includes('isCouncilMember')).map(m => ({value: m.id, label: m.name}))} {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name={`motions.${index}.isPartyProposed`}
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    {t('party_proposed_motion')}
                                    </FormLabel>
                                    <FormDescription>
                                     {t('party_proposed_motion_desc')}
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                    </div>
                )})}
                </div>
                {form.formState.errors.motions?.root && <FormMessage className="mt-2">{form.formState.errors.motions.root.message}</FormMessage>}
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({id: `new-motion-${Date.now()}`, title: '', description: '', isPartyProposed: false, topic: ''})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('add_motion')}
                </Button>
            </div>


            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">{t('cancel')}</Button>
                </DialogClose>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> {t('save_changes')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  {
    options: { value: string; label: string }[];
    value?: string | string[];
    onChange: (value: any) => void;
    "a-type"?: "single" | "multi";
  }
>(({ options, value, onChange, "a-type": type = "multi" }, ref) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useLanguage();
  const isMulti = type === "multi";

  const handleSelect = (selectedValue: string) => {
    if (isMulti) {
        const currentValue = (value as string[] | undefined) || [];
      if (currentValue.includes(selectedValue)) {
        onChange(currentValue.filter((v) => v !== selectedValue));
      } else {
        onChange([...currentValue, selectedValue]);
      }
    } else {
      onChange(selectedValue);
      setOpen(false);
    }
  };
  
  const selectedLabels = isMulti 
    ? options
        .filter((option) => (value as string[] | undefined)?.includes(option.value))
        .map((option) => option.label)
        .join(", ")
    : options.find((option) => option.value === value)?.label || `Select...`;


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          ref={ref}
        >
          <span className="truncate">{selectedLabels || t('select_placeholder')}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={t('search_placeholder')} />
          <CommandList>
            <CommandEmpty>{t('no_results')}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (isMulti && (value as string[] | undefined)?.includes(option.value)) || value === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
MultiSelect.displayName = "MultiSelect";

const Combobox = ({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useLanguage();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label || value
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          filter={(value, search) => {
            const option = options.find(o => o.value.toLowerCase() === value.toLowerCase());
            if (option) return 1;
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder={placeholder}
            onValueChange={(search) => {
               if (!open) setOpen(true);
               const matchingOption = options.find(o => o.label.toLowerCase() === search.toLowerCase());
               onChange(matchingOption ? matchingOption.value : search);
            }}
            value={value}
           />
          <CommandList>
            <CommandEmpty>
                 <div className="p-2 text-sm text-center">
                    {t('no_member_found')}
                </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const optionValue = options.find(o => o.value.toLowerCase() === currentValue.toLowerCase())?.value;
                    onChange(optionValue && optionValue === value ? "" : optionValue || currentValue);
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

    

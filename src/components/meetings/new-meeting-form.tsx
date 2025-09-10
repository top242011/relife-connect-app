
'use client'

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { meetings, locations, allPartyMembers } from "@/lib/data";
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
import { motionTopics } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendMeetingNotification } from "@/services/email";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Location } from "@/lib/types";

const motionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Motion title is required"),
    description: z.string().min(1, "Motion description is required"),
    isPartySponsored: z.boolean().default(false),
    topic: z.string().min(1, "Topic is required"),
    sponsorId: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  date: z.string().min(1, "Date is required"),
  presidingOfficer: z.string().min(1, "Presiding officer is required"),
  attendees: z.array(z.string()).min(1, "At least one attendee is required"),
  motions: z.array(motionSchema).min(1, "At least one motion is required"),
  location: z.enum(locations as [string, ...string[]], { required_error: "Location is required" }),
  meetingType: z.enum(["การประชุมสภา", "การประชุมพรรค"], { required_error: "Meeting type is required" }),
  meetingSession: z.enum(["การประชุมสามัญ", "การประชุมวิสามัญ"], { required_error: "Meeting session is required" }),
}).refine(data => {
    for (const motion of data.motions) {
        if (motion.isPartySponsored && !motion.sponsorId) {
            return false;
        }
    }
    return true;
}, {
    message: "A party-sponsored motion must have a sponsoring member.",
    path: ["motions"],
});


type MeetingFormValues = z.infer<typeof formSchema>;

export function NewMeetingForm({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        date: "",
        presidingOfficer: "",
        attendees: [],
        motions: [{ id: `new-motion-${Date.now()}`, title: '', description: '', isPartySponsored: false, topic: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "motions"
  });


  const onSubmit = (data: MeetingFormValues) => {
    const newMeeting = {
        id: `meet-${Date.now()}`,
        ...data,
    };
    meetings.unshift(newMeeting);

    // Send notifications
    const attendees = allPartyMembers.filter(m => data.attendees.includes(m.id));
    
    // In a real app, you would look up the presiding officer object properly.
    // For this mock, we assume the name string is sufficient for the notification.
    const presidingOfficerName = data.presidingOfficer;

    attendees.forEach(attendee => {
        sendMeetingNotification(attendee, newMeeting, { name: presidingOfficerName });
    });
    
    toast({
        title: "Meeting Created Successfully!",
        description: "Notifications have been sent to all attendees.",
    });

    form.reset();
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Meeting</DialogTitle>
          <DialogDescription>
            Fill in the details for the new meeting. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1 py-4">
            
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Meeting Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField
                    name="presidingOfficer"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Presiding Officer</FormLabel>
                             <Combobox
                                options={allPartyMembers.map(m => ({ value: m.name, label: m.name }))}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select or type officer..."
                            />
                             <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger></FormControl><SelectContent>{locations.map(loc => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="meetingType" render={({ field }) => (
                    <FormItem><FormLabel>Meeting Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="การประชุมสภา">การประชุมสภา</SelectItem><SelectItem value="การประชุมพรรค">การประชุมพรรค</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="meetingSession" render={({ field }) => (
                    <FormItem><FormLabel>Meeting Session</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger></FormControl><SelectContent><SelectItem value="การประชุมสามัญ">การประชุมสามัญ</SelectItem><SelectItem value="การประชุมวิสามัญ">การประชุมวิสามัญ</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
            </div>
             <FormField
                name="attendees"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Attendees</FormLabel>
                            <Select onValueChange={(val) => {
                                if (val === 'all') field.onChange(allPartyMembers.map(m => m.id))
                                else if (val === 'none') field.onChange([])
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Quick Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">ทุกคนเข้าร่วม</SelectItem>
                                    <SelectItem value="none">ทุกคนลา/ขาด</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <MultiSelect options={allPartyMembers.map(m => ({value: m.id, label: m.name}))} {...field} />
                         <FormMessage />
                    </FormItem>
                )}
                />

             <div>
                <h3 className="text-lg font-medium mb-2">Agenda / Motions</h3>
                <div className="space-y-4">
                {fields.map((motion, index) => (
                    <div key={motion.id} className="rounded-md border p-4 space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                         <FormField
                            control={form.control}
                            name={`motions.${index}.title`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motion Title</FormLabel>
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
                                    <FormLabel>Motion Description</FormLabel>
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
                                        <FormLabel>Topic</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a topic" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {motionTopics.map(topic => (
                                                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name={`motions.${index}.sponsorId`}
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Sponsoring Member</FormLabel>
                                        <MultiSelect a-type="single" options={allPartyMembers.filter(m => m.roles.includes('MP')).map(m => ({value: m.id, label: m.name}))} {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name={`motions.${index}.isPartySponsored`}
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
                                    Party-Sponsored Motion
                                    </FormLabel>
                                    <FormDescription>
                                     Indicates this motion is officially put forth by the party.
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
                </div>
                 {form.formState.errors.motions?.root && <FormMessage className="mt-2">{form.formState.errors.motions.root.message}</FormMessage>}
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({id: `new-motion-${Date.now()}`, title: '', description: '', isPartySponsored: false, topic: ''})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Motion
                </Button>
            </div>


            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Meeting</Button>
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
          <span className="truncate">{selectedLabels || "Select..."}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
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
        <Command>
          <CommandInput
            placeholder={placeholder}
            onValueChange={(search) => {
              const match = options.find(o => o.label.toLowerCase() === search.toLowerCase());
              if (!match) {
                onChange(search);
              }
            }}
           />
          <CommandList>
            <CommandEmpty>
                 <div className="p-2 text-sm text-center">
                    No member found. You can add a custom name.
                </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
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

'use client'

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { Meeting, Member, MP } from "@/lib/types";
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
import { Edit, Save, PlusCircle, Trash2 } from "lucide-react";
import { members as allMembers, mps as allMps } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Textarea } from "../ui/textarea";

const allPartyMembers = [...allMembers, ...allMps];

const motionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Motion title is required"),
    description: z.string().min(1, "Motion description is required"),
});

const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  date: z.string().min(1, "Date is required"),
  presidingOfficer: z.string().min(1, "Presiding officer is required"),
  attendees: z.array(z.string()).min(1, "At least one attendee is required"),
  motions: z.array(motionSchema).min(1, "At least one motion is required"),
});


type MeetingFormValues = z.infer<typeof formSchema>;

export function EditMeetingForm({ meeting, children }: { meeting: Meeting, children: React.ReactNode }) {
  const defaultValues: Partial<MeetingFormValues> = {
    title: meeting.title,
    date: meeting.date,
    presidingOfficer: meeting.presidingOfficer,
    attendees: meeting.attendees,
    motions: meeting.motions,
  };

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "motions"
  });


  const onSubmit = (data: MeetingFormValues) => {
    // In a real app, you would send this data to your backend
    console.log("Form submitted with data:", data);
    // You could show a toast message here
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Meeting: {meeting.title}</DialogTitle>
          <DialogDescription>
            Make changes to the meeting details here. Click save when you're done.
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
                            <MultiSelect a-type="single" options={allPartyMembers.map(m => ({value: m.id, label: m.name}))} {...field} />
                             <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
             <FormField
                name="attendees"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Attendees</FormLabel>
                         <MultiSelect options={allPartyMembers.map(m => ({value: m.id, label: m.name}))} {...field} />
                         <FormMessage />
                    </FormItem>
                )}
                />

             <div>
                <h3 className="text-lg font-medium mb-2">Agenda / Motions</h3>
                <div className="space-y-4">
                {fields.map((motion, index) => (
                    <div key={motion.id} className="rounded-md border p-4 space-y-2 relative">
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
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({id: `new-motion-${Date.now()}`, title: '', description: ''})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Motion
                </Button>
            </div>


            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
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
          <span className="truncate">{selectedLabels}</span>
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

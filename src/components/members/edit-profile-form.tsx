
'use client'

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { Member, MP } from "@/lib/types";
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
import { Edit, Save } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { committeeNames } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  contact: z.string().optional(),
  location: z.string(),
  age: z.coerce.number().min(18, "Must be at least 18"),
  gender: z.enum(["Male", "Female", "Other"]),
  education: z.string(),
  professionalBackground: z.string(),
  roles: z.array(z.string()),
  committeeMemberships: z.array(z.string()),
  activityLog: z.string().optional(),
  volunteerWork: z.string().optional(),
  // MP fields
  electoralHistory: z.string().optional(),
  parliamentaryRoles: z.string().optional(),
  keyPolicyInterests: z.string().optional(),
});


type ProfileFormValues = z.infer<typeof formSchema>;

const roles = [
  { id: 'isPartyMember', label: 'Party Member' },
  { id: 'isMP', label: 'Member of Parliament (MP)' },
  { id: 'isExec', label: 'Executive Committee Member' },
]

export function EditProfileForm({ member }: { member: Member | MP }) {
  const isMP = 'electoralHistory' in member;

  const defaultValues: Partial<ProfileFormValues> = {
    name: member.name,
    email: member.email,
    contact: (member as Member).contact,
    location: member.location,
    age: member.age,
    gender: member.gender,
    education: member.education,
    professionalBackground: member.professionalBackground,
    roles: [
        'isPartyMember',
        ...(isMP ? ['isMP'] : []),
        ...(member as Member).committeeMemberships?.includes('Executive') ? ['isExec'] : [],
    ],
    committeeMemberships: (member as Member).committeeMemberships,
    activityLog: (member as Member).activityLog,
    volunteerWork: (member as Member).volunteerWork,
    electoralHistory: (member as MP).electoralHistory,
    parliamentaryRoles: (member as MP).parliamentaryRoles,
    keyPolicyInterests: (member as MP).keyPolicyInterests,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, you would send this data to your backend
    console.log(data);
    // You could show a toast message here
  };
  
  const watchedRoles = form.watch("roles", []);
  const isMpSelected = watchedRoles.includes('isMP');
  
  React.useEffect(() => {
    if (isMpSelected && !watchedRoles.includes('isPartyMember')) {
      form.setValue('roles', [...watchedRoles, 'isPartyMember']);
    }
  }, [isMpSelected, watchedRoles, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile: {member.name}</DialogTitle>
          <DialogDescription>
            Make changes to the member's profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1 py-4">
            <h3 className="text-lg font-medium">Roles & Status</h3>
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Roles</FormLabel>
                    <FormDescription>
                      Select the roles for this member.
                    </FormDescription>
                  </div>
                  {roles.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="roles"
                      render={({ field }) => {
                        const isDisabled = item.id === 'isPartyMember' && field.value?.includes('isMP');
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                disabled={isDisabled}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-lg font-medium border-t pt-4">Personal Information</h3>
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location / Constituency</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="education" render={({ field }) => (
                <FormItem><FormLabel>Education</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="professionalBackground" render={({ field }) => (
                <FormItem><FormLabel>Professional Background</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

             <h3 className="text-lg font-medium border-t pt-4">Party Information</h3>
              <FormField 
                control={form.control} 
                name="committeeMemberships" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Committee Memberships</FormLabel>
                        <MultiSelect 
                            options={committeeNames.map(c => ({ value: c, label: c }))} 
                            {...field}
                        />
                        <FormDescription>Select the committees this member belongs to.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
              />
             <FormField control={form.control} name="activityLog" render={({ field }) => (
                <FormItem><FormLabel>Activity Log</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="volunteerWork" render={({ field }) => (
                <FormItem><FormLabel>Volunteer Work</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            {isMpSelected && (
                <>
                 <h3 className="text-lg font-medium border-t pt-4">Parliamentary Information</h3>
                 <FormField control={form.control} name="electoralHistory" render={({ field }) => (
                    <FormItem><FormLabel>Electoral History</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="parliamentaryRoles" render={({ field }) => (
                    <FormItem><FormLabel>Parliamentary Roles</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="keyPolicyInterests" render={({ field }) => (
                    <FormItem><FormLabel>Key Policy Interests</FormLabel><FormControl><Textarea placeholder="Comma-separated list..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                </>
            )}

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
    value?: string[];
    onChange: (value: any) => void;
  }
>(({ options, value, onChange }, ref) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue: string) => {
    const currentValue = value || [];
    if (currentValue.includes(selectedValue)) {
      onChange(currentValue.filter((v) => v !== selectedValue));
    } else {
      onChange([...currentValue, selectedValue]);
    }
  };
  
  const selectedLabels = options
        .filter((option) => (value || []).includes(option.value))
        .map((option) => option.label)
        .join(", ");


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
                      (value || []).includes(option.value)
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

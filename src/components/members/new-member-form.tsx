
'use client'

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
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
import { Save } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { getCommitteeNames, getLocations, createMember } from "@/lib/supabase/queries";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  contact: z.string().optional(),
  location: z.string().min(1, "Location is required"),
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

export function NewMemberForm({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [committeeOptions, setCommitteeOptions] = React.useState<string[]>([]);
  const [locationOptions, setLocationOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const [committees, locations] = await Promise.all([
          getCommitteeNames(),
          getLocations()
        ]);
        setCommitteeOptions(committees);
        setLocationOptions(locations);
      };
      fetchData();
    }
  }, [open]);

  const defaultValues: Partial<ProfileFormValues> = {
    name: "",
    email: "",
    contact: "",
    location: "",
    age: 18,
    gender: "Other",
    education: "",
    professionalBackground: "",
    roles: ['isPartyMember'],
    committeeMemberships: [],
    activityLog: "",
    volunteerWork: "",
    electoralHistory: "",
    parliamentaryRoles: "",
    keyPolicyInterests: "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
        await createMember(data);
        toast({
            title: t('toast_member_created_title'),
            description: t('toast_member_created_desc', { name: data.name }),
        });
        form.reset();
        setOpen(false);
        router.refresh();
    } catch (error) {
        toast({
            title: "Creation Failed",
            description: "An error occurred while creating the member.",
            variant: "destructive",
        });
        console.error("Failed to create member:", error);
    }
  };
  
  const watchedRoles = form.watch("roles", []);
  const isMpSelected = watchedRoles.includes('isMP');
  
  React.useEffect(() => {
    if (isMpSelected && !watchedRoles.includes('isPartyMember')) {
      form.setValue('roles', [...watchedRoles, 'isPartyMember']);
    }
  }, [isMpSelected, watchedRoles, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('new_member_title')}</DialogTitle>
          <DialogDescription>
            {t('new_member_subtitle')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1 py-4">
            <h3 className="text-lg font-medium">{t('roles_status_title')}</h3>
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">{t('roles')}</FormLabel>
                    <FormDescription>
                      {t('roles_desc')}
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
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t(item.label as any)}
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

            <h3 className="text-lg font-medium border-t pt-4">{t('personal_information_title')}</h3>
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('full_name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>{t('email')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>{t('age')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>{t('gender')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t('select_gender')} /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Male">{t('Male')}</SelectItem>
                                <SelectItem value="Female">{t('Female')}</SelectItem>
                                <SelectItem value="Other">{t('Other')}</SelectItem>
                            </SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>{t('location_constituency')}</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('select_location')} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {locationOptions.map(loc => (
                            <SelectItem key={loc} value={loc}>{t(loc as any)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}/>
             <FormField control={form.control} name="education" render={({ field }) => (
                <FormItem><FormLabel>{t('education')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="professionalBackground" render={({ field }) => (
                <FormItem><FormLabel>{t('professional_background')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

             <h3 className="text-lg font-medium border-t pt-4">{t('party_information_title')}</h3>
              <FormField 
                control={form.control} 
                name="committeeMemberships" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('committee_memberships')}</FormLabel>
                        <MultiSelect 
                            options={committeeOptions.map(c => ({ value: c, label: t(c as any) }))} 
                            {...field}
                        />
                        <FormDescription>{t('committee_memberships_desc')}</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
              />
             <FormField control={form.control} name="activityLog" render={({ field }) => (
                <FormItem><FormLabel>{t('activity_log')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="volunteerWork" render={({ field }) => (
                <FormItem><FormLabel>{t('volunteer_work')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            {isMpSelected && (
                <>
                 <h3 className="text-lg font-medium border-t pt-4">{t('parliamentary_information_title')}</h3>
                 <FormField control={form.control} name="electoralHistory" render={({ field }) => (
                    <FormItem><FormLabel>{t('electoral_history')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="parliamentaryRoles" render={({ field }) => (
                    <FormItem><FormLabel>{t('parliamentary_roles')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="keyPolicyInterests" render={({ field }) => (
                    <FormItem><FormLabel>{t('key_policy_interests')}</FormLabel><FormControl><Textarea placeholder={t('key_policy_interests_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                </>
            )}

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">{t('cancel')}</Button>
                </DialogClose>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> {t('create_member_button')}</Button>
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
    const { t } = useLanguage();
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


    

    



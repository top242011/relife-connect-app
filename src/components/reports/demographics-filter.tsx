'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useLanguage } from '@/hooks/use-language';
import { FilterState } from '@/app/reports/demographics/page';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Separator } from '../ui/separator';

interface DemographicsFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
  committeeOptions: string[];
  locationOptions: string[];
}

const roles = [
  { id: 'isExec', label: 'Executive Committee Member' },
  { id: 'isMP', label: 'Member of Parliament (MP)' },
  { id: 'isPartyMember', label: 'Party Member' },
];

const years = [1, 2, 3, 4, 5, 6];

export function DemographicsFilter({
  filters,
  onFilterChange,
  onClear,
  committeeOptions,
  locationOptions,
}: DemographicsFilterProps) {
  const { t } = useLanguage();

  const handleInputChange = (field: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [field]: value });
  };
  
  const handleCheckboxChange = (field: keyof Pick<FilterState, 'roles' | 'committees' | 'age'>, id: string | number) => {
    const currentValues = filters[field] as any[];
    const newValues = currentValues.includes(id)
      ? currentValues.filter((v: any) => v !== id)
      : [...currentValues, id];
    onFilterChange({ ...filters, [field]: newValues });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('filter_options_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Roles Filter */}
          <div className="space-y-2">
            <Label>{t('role')}</Label>
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={filters.roles.includes(role.id)}
                  onCheckedChange={() => handleCheckboxChange('roles', role.id)}
                />
                <label htmlFor={`role-${role.id}`} className="text-sm font-medium leading-none">
                  {t(role.label)}
                </label>
              </div>
            ))}
          </div>
          
          {/* Demographics Filters */}
          <div className="space-y-4">
             <div>
                <Label htmlFor="gender-filter">{t('gender')}</Label>
                <Select value={filters.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger id="gender-filter"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('select_all')}</SelectItem>
                        <SelectItem value="Male">{t('Male')}</SelectItem>
                        <SelectItem value="Female">{t('Female')}</SelectItem>
                        <SelectItem value="Other">{t('Other')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label htmlFor="location-filter">{t('location')}</Label>
                <Select value={filters.location} onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger id="location-filter"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('select_all')}</SelectItem>
                        {locationOptions.map(loc => <SelectItem key={loc} value={loc}>{t(loc as any)}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label>{t('age')}</Label>
                 <MultiSelectPopover
                    placeholder={t('select_year')}
                    options={years.map(y => ({ value: y, label: String(y) }))}
                    selected={filters.age}
                    onChange={(selected) => handleInputChange('age', selected)}
                />
            </div>
          </div>
          
           {/* Committee & Policy Filters */}
           <div className="space-y-4">
             <div>
                <Label>{t('committees')}</Label>
                <MultiSelectPopover
                    placeholder={t('select_committee')}
                    options={committeeOptions.map(c => ({ value: c, label: t(c as any) }))}
                    selected={filters.committees}
                    onChange={(selected) => handleInputChange('committees', selected)}
                />
            </div>
             <div>
                <Label htmlFor="policy-filter">{t('key_policy_interests')}</Label>
                <Input
                    id="policy-filter"
                    placeholder={t('search_placeholder')}
                    value={filters.policyInterest}
                    onChange={(e) => handleInputChange('policyInterest', e.target.value)}
                />
            </div>
          </div>

          <div className="flex flex-col justify-end items-start gap-2">
            <Button onClick={() => onFilterChange(filters)} className="w-full">
              {t('search')}
            </Button>
            <Button onClick={onClear} variant="ghost" className="w-full">
              {t('clear_filters')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const MultiSelectPopover = ({ placeholder, options, selected, onChange }: {
    placeholder: string;
    options: { value: any; label: string }[];
    selected: any[];
    onChange: (selected: any[]) => void;
}) => {
    const [open, setOpen] = React.useState(false);
    const { t } = useLanguage();

    const handleSelect = (value: any) => {
        const newSelected = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const selectedLabels = options
        .filter(opt => selected.includes(opt.value))
        .map(opt => opt.label)
        .join(', ');

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                    <span className="truncate">{selectedLabels || placeholder}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={t('search_placeholder')} />
                    <CommandList>
                        <CommandEmpty>{t('no_results')}</CommandEmpty>
                        <CommandGroup>
                            {options.map(option => (
                                <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                                    <Check className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")} />
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

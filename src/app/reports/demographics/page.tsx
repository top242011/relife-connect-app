'use client';

import * as React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Member } from '@/lib/types';
import { getAllMembers, getCommitteeNames, getLocations } from '@/lib/supabase/queries';
import { DemographicsFilter } from '@/components/reports/demographics-filter';
import { DemographicsResults } from '@/components/reports/demographics-results';

export interface FilterState {
    roles: string[];
    gender: string;
    committees: string[];
    policyInterest: string;
    location: string;
    year: number[];
}

export default function DemographicsReportPage() {
    const { t } = useLanguage();
    const [allMembers, setAllMembers] = React.useState<Member[]>([]);
    const [filteredMembers, setFilteredMembers] = React.useState<Member[]>([]);
    const [committeeOptions, setCommitteeOptions] = React.useState<string[]>([]);
    const [locationOptions, setLocationOptions] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);

    const initialFilters: FilterState = React.useMemo(() => ({
        roles: [],
        gender: 'all',
        committees: [],
        policyInterest: '',
        location: 'all',
        year: [],
    }), []);

    const [filters, setFilters] = React.useState<FilterState>(initialFilters);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [membersData, committeesData, locationsData] = await Promise.all([
                    getAllMembers(),
                    getCommitteeNames(),
                    getLocations(),
                ]);
                setAllMembers(membersData);
                setFilteredMembers(membersData);
                setCommitteeOptions(committeesData);
                setLocationOptions(locationsData);
            } catch (error) {
                console.error("Failed to fetch initial data for demographics report", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        let results = [...allMembers];

        // Role filter
        if (newFilters.roles.length > 0) {
            results = results.filter(m => m.roles && newFilters.roles.some(role => m.roles!.includes(role)));
        }

        // Gender filter
        if (newFilters.gender !== 'all') {
            results = results.filter(m => m.gender === newFilters.gender);
        }

        // Committee filter
        if (newFilters.committees.length > 0) {
            results = results.filter(m => m.committeeMemberships && newFilters.committees.every(com => m.committeeMemberships!.includes(com)));
        }
        
        // Policy interest filter
        if (newFilters.policyInterest.trim()) {
            const keyword = newFilters.policyInterest.trim().toLowerCase();
            results = results.filter(m => m.policyInterests && m.policyInterests.toLowerCase().includes(keyword));
        }

        // Location filter
        if (newFilters.location !== 'all') {
            results = results.filter(m => m.location === newFilters.location);
        }

        // Year filter
        if (newFilters.year.length > 0) {
            results = results.filter(m => m.year && newFilters.year.includes(m.year));
        }

        setFilteredMembers(results);
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
        setFilteredMembers(allMembers);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('demographics_report_title')}</h1>
                <p className="text-muted-foreground">
                    {t('demographics_report_subtitle')}
                </p>
            </div>
            <DemographicsFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
                committeeOptions={committeeOptions}
                locationOptions={locationOptions}
            />
            <DemographicsResults members={filteredMembers} loading={loading} />
        </div>
    )
}

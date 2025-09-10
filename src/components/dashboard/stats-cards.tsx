'use client';
import * as React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { getAllMembers, getAllMeetings } from "@/lib/supabase/queries"
  import { Users, Landmark, Calendar } from "lucide-react"
  import { useLanguage } from "@/hooks/use-language"
import { Member, Meeting } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
  
  export function StatsCards() {
    const { t } = useLanguage();
    const [loading, setLoading] = React.useState(true);
    const [members, setMembers] = React.useState<Member[]>([]);
    const [meetings, setMeetings] = React.useState<Meeting[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [membersData, meetingsData] = await Promise.all([
                    getAllMembers(),
                    getAllMeetings(),
                ]);
                setMembers(membersData);
                setMeetings(meetingsData);
            } catch (error) {
                console.error("Failed to fetch stats data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalMembers = members.length;
    const mps = members.filter(m => m.roles.includes('isMP')).length;
    const upcomingMeetings = meetings.filter(m => new Date(m.date) >= new Date()).length;

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-24" />
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-7 w-12" />
                        <Skeleton className="h-4 w-32 mt-1" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-36" />
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-7 w-12" />
                        <Skeleton className="h-4 w-24 mt-1" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-32" />
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-7 w-12" />
                        <Skeleton className="h-4 w-28 mt-1" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_members')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">{t('total_members_subtitle')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('members_of_parliament')}</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mps}</div>
            <p className="text-xs text-muted-foreground">{t('members_of_parliament_subtitle', { count: mps })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('upcoming_meetings')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground">{t('upcoming_meetings_subtitle')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  

'use client';

import * as React from 'react';
import { Member } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

interface DemographicsResultsProps {
  members: Member[];
  loading: boolean;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export function DemographicsResults({ members, loading }: DemographicsResultsProps) {
    const { t } = useLanguage();

    const genderData = React.useMemo(() => {
        const counts = members.reduce((acc, member) => {
            const gender = member.gender || 'Other';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name: t(name), value }));
    }, [members, t]);

    const locationData = React.useMemo(() => {
        const counts = members.reduce((acc, member) => {
            const location = member.location || 'Unknown';
            acc[location] = (acc[location] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name: t(name as any), value }));
    }, [members, t]);
    
    if (loading) {
        return <Skeleton className="h-96" />
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('results_title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('total_results')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t('gender_distribution_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                         <PieChart>
                            <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('campus_distribution_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={locationData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        
        {/* Data Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('role')}</TableHead>
                <TableHead>{t('age')}</TableHead>
                <TableHead>{t('gender')}</TableHead>
                <TableHead>{t('location')}</TableHead>
                <TableHead>{t('committees')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                        <div className='flex flex-wrap gap-1'>
                            {member.roles?.map(r => <Badge key={r} variant="outline">{t(r as any)}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell>{member.age}</TableCell>
                    <TableCell>{t(member.gender as any)}</TableCell>
                    <TableCell>{t(member.location as any)}</TableCell>
                     <TableCell>
                        <div className='flex flex-wrap gap-1'>
                            {member.committeeMemberships?.map(c => <Badge key={c} variant="secondary">{t(c as any)}</Badge>)}
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t('no_results')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

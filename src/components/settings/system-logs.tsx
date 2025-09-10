'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSystemLogs } from "@/lib/supabase/queries";
import { SystemLog } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";

export function SystemLogs() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
    
    useEffect(() => {
        const fetchLogs = async () => {
            const logs = await getSystemLogs();
            setSystemLogs(logs);
        };
        fetchLogs();
    }, []);

    const filteredLogs = systemLogs
        .filter(log => log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.details.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(log => actionFilter === "all" || log.action === actionFilter);

    const uniqueActions = ["all", ...Array.from(new Set(systemLogs.map(log => log.action)))];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('system_logs_title')}</CardTitle>
                <CardDescription>{t('system_logs_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex items-center space-x-4 mb-4">
                    <Input
                        placeholder={t('search_logs_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                     <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('filter_by_action_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueActions.map(action => (
                                <SelectItem key={action} value={action}>{t(action as any)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border max-h-[500px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('timestamp')}</TableHead>
                                <TableHead>{t('user')}</TableHead>
                                <TableHead>{t('action')}</TableHead>
                                <TableHead>{t('details')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.timestamp}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell><Badge variant="outline">{t(log.action as any)}</Badge></TableCell>
                                    <TableCell>{t(log.details as any, {id: log.details.match(/"([^"]*)"/)?.[1] || ''})}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

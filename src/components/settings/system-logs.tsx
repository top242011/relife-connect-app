
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { systemLogs } from "@/lib/data";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";

export function SystemLogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState("all");

    const filteredLogs = systemLogs
        .filter(log => log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.details.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(log => actionFilter === "all" || log.action === actionFilter);

    const uniqueActions = ["all", ...Array.from(new Set(systemLogs.map(log => log.action)))];

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Activity Log</CardTitle>
                <CardDescription>A record of all major actions taken within the system.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex items-center space-x-4 mb-4">
                    <Input
                        placeholder="Search logs by user or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                     <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by action" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueActions.map(action => (
                                <SelectItem key={action} value={action}>{action}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border max-h-[500px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.timestamp}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                                    <TableCell>{log.details}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

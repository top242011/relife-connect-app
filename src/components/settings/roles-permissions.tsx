
'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { roles, permissions, members, mps } from "@/lib/data";
import { Role, Permission } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { UsersTable } from "./users-table";
import { Badge } from "../ui/badge";

const allUsers = [...members, ...mps];

export function RolesPermissions() {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Role Management</CardTitle>
                    <CardDescription>Define roles and assign permissions to control access to system features.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map(role => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{role.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.map(pId => {
                                                const permission = permissions.find(p => p.id === pId);
                                                return <Badge key={pId} variant="secondary">{permission?.name}</Badge>
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Role: {role.name}</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4">
                                                     <h3 className="text-lg font-medium mb-2">Permissions</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {permissions.map(permission => (
                                                            <div key={permission.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`${role.id}-${permission.id}`}
                                                                    checked={role.permissions.includes(permission.id)}
                                                                />
                                                                <label htmlFor={`${role.id}-${permission.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    {permission.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>User Account Management</CardTitle>
                    <CardDescription>Assign roles to users and manage their account status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersTable users={allUsers} roles={roles} />
                </CardContent>
            </Card>
        </div>
    )
}

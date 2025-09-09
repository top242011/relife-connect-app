
'use client'

import { Member, MP, Role } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

type User = Member | MP;

export function UsersTable({ users, roles }: { users: User[], roles: Role[] }) {
    // In a real app, user roles would be stored and fetched from a database
    const getUserRoles = (userId: string) => {
        if (userId.startsWith('mp')) return ["Admin"];
        if (userId === 'mem-1') return ["Admin", "HR Manager"];
        return ["Member"];
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{user.name}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {getUserRoles(user.id).map(roleName => (
                                        <Badge key={roleName}>{roleName}</Badge>
                                    ))}
                                </div>
                            </TableCell>
                             <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Switch id={`active-status-${user.id}`} defaultChecked />
                                    <Label htmlFor={`active-status-${user.id}`}>Active</Label>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit Roles</DropdownMenuItem>
                                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-500">Deactivate Account</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { roles, permissions, allPartyMembers } from "@/lib/data";
import { Role } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Edit, Trash2, Save } from "lucide-react";
import { UsersTable } from "./users-table";
import { Badge } from "../ui/badge";
import { useLanguage } from "@/hooks/use-language";


const EditRoleDialog = ({ role }: { role: Role }) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [currentPermissions, setCurrentPermissions] = useState(role.permissions);

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        if (checked) {
            setCurrentPermissions([...currentPermissions, permissionId]);
        } else {
            setCurrentPermissions(currentPermissions.filter(p => p !== permissionId));
        }
    };

    const handleSave = () => {
        console.log(`Saving role ${role.id} with permissions:`, currentPermissions);
        setIsOpen(false);
    }

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('edit_role_title')}: {t(role.name as any)}</DialogTitle>
                    <DialogDescription>{t('edit_role_subtitle')}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                        <h3 className="text-lg font-medium mb-2">{t('permissions')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {permissions.map(permission => (
                            <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${role.id}-${permission.id}`}
                                    checked={currentPermissions.includes(permission.id)}
                                    onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                                />
                                <label htmlFor={`${role.id}-${permission.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t(permission.name as any)}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">{t('cancel')}</Button>
                    </DialogClose>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>{t('save_changes')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function RolesPermissions() {
    const { t } = useLanguage();
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('role_management_title')}</CardTitle>
                    <CardDescription>{t('role_management_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('role')}</TableHead>
                                <TableHead>{t('permissions')}</TableHead>
                                <TableHead className="text-right">{t('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map(role => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{t(role.name as any)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.map(pId => {
                                                const permission = permissions.find(p => p.id === pId);
                                                return <Badge key={pId} variant="secondary">{permission ? t(permission.name as any) : ''}</Badge>
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <EditRoleDialog role={role} />
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
                    <CardTitle>{t('user_account_management_title')}</CardTitle>
                    <CardDescription>{t('user_account_management_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersTable users={allPartyMembers} roles={roles} />
                </CardContent>
            </Card>
        </div>
    )
}

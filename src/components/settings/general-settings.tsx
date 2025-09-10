'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Edit, Save, X } from 'lucide-react';
import { getMotionTopics, getCommitteeNames, addMotionTopic, deleteMotionTopic, updateMotionTopic, addCommitteeName, deleteCommitteeName, updateCommitteeName } from '@/lib/supabase/queries';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

export function GeneralSettings() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [motionTopics, setMotionTopics] = useState<string[]>([]);
    const [committeeNames, setCommitteeNames] = useState<string[]>([]);

    const fetchTopics = async () => {
        const topics = await getMotionTopics();
        setMotionTopics(topics);
    };

    const fetchCommittees = async () => {
        const committees = await getCommitteeNames();
        setCommitteeNames(committees);
    };

    useEffect(() => {
        fetchTopics();
        fetchCommittees();
    }, []);

    const [newTopic, setNewTopic] = useState("");
    const [newCommittee, setNewCommittee] = useState("");

    const [editingTopic, setEditingTopic] = useState<string | null>(null);
    const [editingTopicValue, setEditingTopicValue] = useState("");
    
    const [editingCommittee, setEditingCommittee] = useState<string | null>(null);
    const [editingCommitteeValue, setEditingCommitteeValue] = useState("");

    const handleAddTopic = async () => {
        if (newTopic && !motionTopics.includes(newTopic)) {
            try {
                await addMotionTopic(newTopic);
                await fetchTopics(); // Re-fetch to confirm
                setNewTopic("");
                toast({ title: "Topic Added", description: `"${newTopic}" has been added.` });
            } catch (error) {
                toast({ title: "Error", description: "Failed to add topic.", variant: "destructive" });
            }
        }
    };

    const handleDeleteTopic = async (topic: string) => {
        try {
            await deleteMotionTopic(topic);
            await fetchTopics();
            toast({ title: "Topic Deleted", description: `"${topic}" has been deleted.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete topic.", variant: "destructive" });
        }
    };

    const handleEditTopic = (topic: string) => {
        setEditingTopic(topic);
        setEditingTopicValue(topic);
    };

    const handleSaveTopic = async () => {
        if (editingTopic && editingTopicValue) {
            try {
                await updateMotionTopic(editingTopic, editingTopicValue);
                await fetchTopics();
                setEditingTopic(null);
                setEditingTopicValue("");
                toast({ title: "Topic Updated", description: `Topic has been updated to "${editingTopicValue}".` });
            } catch (error) {
                toast({ title: "Error", description: "Failed to update topic.", variant: "destructive" });
            }
        }
    };


    const handleAddCommittee = async () => {
        if (newCommittee && !committeeNames.includes(newCommittee)) {
            try {
                await addCommitteeName(newCommittee);
                await fetchCommittees();
                setNewCommittee("");
                toast({ title: "Committee Added", description: `"${newCommittee}" has been added.` });
            } catch (error) {
                 toast({ title: "Error", description: "Failed to add committee.", variant: "destructive" });
            }
        }
    };

    const handleDeleteCommittee = async (committee: string) => {
         try {
            await deleteCommitteeName(committee);
            await fetchCommittees();
            toast({ title: "Committee Deleted", description: `"${committee}" has been deleted.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete committee.", variant: "destructive" });
        }
    };
    
    const handleEditCommittee = (committee: string) => {
        setEditingCommittee(committee);
        setEditingCommitteeValue(committee);
    };

    const handleSaveCommittee = async () => {
        if (editingCommittee && editingCommitteeValue) {
            try {
                await updateCommitteeName(editingCommittee, editingCommitteeValue);
                await fetchCommittees();
                setEditingCommittee(null);
                setEditingCommitteeValue("");
                toast({ title: "Committee Updated", description: `Committee has been updated to "${editingCommitteeValue}".` });
            } catch (error) {
                toast({ title: "Error", description: "Failed to update committee.", variant: "destructive" });
            }
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t('manage_motion_topics_title')}</CardTitle>
                    <CardDescription>{t('manage_motion_topics_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder={t('new_topic_placeholder')}
                            />
                            <Button onClick={handleAddTopic}><PlusCircle className="mr-2 h-4 w-4" /> {t('add_topic_button')}</Button>
                        </div>
                        <div className="rounded-md border max-h-60 overflow-y-auto">
                            <Table>
                                <TableBody>
                                    {motionTopics.map(topic => (
                                        <TableRow key={topic}>
                                            <TableCell>
                                                {editingTopic === topic ? (
                                                    <Input value={editingTopicValue} onChange={(e) => setEditingTopicValue(e.target.value)} />
                                                ) : (
                                                    t(topic as any)
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {editingTopic === topic ? (
                                                     <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="outline" onClick={handleSaveTopic}><Save className="h-4 w-4" /></Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setEditingTopic(null)}><X className="h-4 w-4" /></Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => handleEditTopic(topic)}><Edit className="h-4 w-4" /></Button>
                                                        <Button size="icon" variant="destructive" onClick={() => handleDeleteTopic(topic)}><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('manage_committee_names_title')}</CardTitle>
                    <CardDescription>{t('manage_committee_names_subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                value={newCommittee}
                                onChange={(e) => setNewCommittee(e.target.value)}
                                placeholder={t('new_committee_placeholder')}
                            />
                            <Button onClick={handleAddCommittee}><PlusCircle className="mr-2 h-4 w-4" /> {t('add_committee_button')}</Button>
                        </div>
                        <div className="rounded-md border max-h-60 overflow-y-auto">
                            <Table>
                                <TableBody>
                                    {committeeNames.map(committee => (
                                        <TableRow key={committee}>
                                            <TableCell>
                                                {editingCommittee === committee ? (
                                                    <Input value={editingCommitteeValue} onChange={(e) => setEditingCommitteeValue(e.target.value)} />
                                                ) : (
                                                    t(committee as any)
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                 {editingCommittee === committee ? (
                                                     <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="outline" onClick={handleSaveCommittee}><Save className="h-4 w-4" /></Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setEditingCommittee(null)}><X className="h-4 w-4" /></Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => handleEditCommittee(committee)}><Edit className="h-4 w-4" /></Button>
                                                        <Button size="icon" variant="destructive" onClick={() => handleDeleteCommittee(committee)}><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

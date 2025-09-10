'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Edit, Save, X } from 'lucide-react';
import { getMotionTopics, getCommitteeNames } from '@/lib/supabase/queries';
import { useLanguage } from '@/hooks/use-language';

export function GeneralSettings() {
    const { t } = useLanguage();
    const [motionTopics, setMotionTopics] = useState<string[]>([]);
    const [committeeNames, setCommitteeNames] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [topics, committees] = await Promise.all([getMotionTopics(), getCommitteeNames()]);
            setMotionTopics(topics);
            setCommitteeNames(committees);
        };
        fetchData();
    }, []);

    const [newTopic, setNewTopic] = useState("");
    const [newCommittee, setNewCommittee] = useState("");

    const [editingTopic, setEditingTopic] = useState<string | null>(null);
    const [editingTopicValue, setEditingTopicValue] = useState("");
    
    const [editingCommittee, setEditingCommittee] = useState<string | null>(null);
    const [editingCommitteeValue, setEditingCommitteeValue] = useState("");

    const handleAddTopic = () => {
        if (newTopic && !motionTopics.includes(newTopic)) {
            setMotionTopics([...motionTopics, newTopic]);
            setNewTopic("");
        }
    };

    const handleDeleteTopic = (topic: string) => {
        setMotionTopics(motionTopics.filter(t => t !== topic));
    };

    const handleEditTopic = (topic: string) => {
        setEditingTopic(topic);
        setEditingTopicValue(topic);
    };

    const handleSaveTopic = () => {
        if (editingTopic && editingTopicValue) {
            setMotionTopics(motionTopics.map(t => t === editingTopic ? editingTopicValue : t));
            setEditingTopic(null);
            setEditingTopicValue("");
        }
    };


    const handleAddCommittee = () => {
        if (newCommittee && !committeeNames.includes(newCommittee)) {
            setCommitteeNames([...committeeNames, newCommittee]);
            setNewCommittee("");
        }
    };

    const handleDeleteCommittee = (committee: string) => {
        setCommitteeNames(committeeNames.filter(c => c !== committee));
    };
    
    const handleEditCommittee = (committee: string) => {
        setEditingCommittee(committee);
        setEditingCommitteeValue(committee);
    };

    const handleSaveCommittee = () => {
        if (editingCommittee && editingCommitteeValue) {
            setCommitteeNames(committeeNames.map(c => c === editingCommittee ? editingCommitteeValue : c));
            setEditingCommittee(null);
            setEditingCommitteeValue("");
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

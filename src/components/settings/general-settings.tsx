
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Edit, Save, X } from 'lucide-react';

const initialMotionTopics = ["Economy", "Social", "Security", "Foreign Affairs", "Education"];
const initialCommitteeNames = ["Finance", "Outreach", "Judiciary", "Economic Affairs", "Education", "Culture", "Strategy"];

export function GeneralSettings() {
    const [motionTopics, setMotionTopics] = useState(initialMotionTopics);
    const [committeeNames, setCommitteeNames] = useState(initialCommitteeNames);

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
                    <CardTitle>Manage Motion Topics</CardTitle>
                    <CardDescription>Add, edit, or delete topics used for categorizing motions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="New topic name"
                            />
                            <Button onClick={handleAddTopic}><PlusCircle className="mr-2 h-4 w-4" /> Add Topic</Button>
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
                                                    topic
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
                    <CardTitle>Manage Committee Names</CardTitle>
                    <CardDescription>Add, edit, or delete committee names for member profiles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                value={newCommittee}
                                onChange={(e) => setNewCommittee(e.target.value)}
                                placeholder="New committee name"
                            />
                            <Button onClick={handleAddCommittee}><PlusCircle className="mr-2 h-4 w-4" /> Add Committee</Button>
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
                                                    committee
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

'use client';
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import React from "react";

export function MeetingScheduler() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <Card>
            <CardHeader>
                <CardTitle>Schedule a New Meeting</CardTitle>
                <CardDescription>
                    Fill in the details below to schedule a new meeting. Automated reminders will be sent out.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Meeting Title</Label>
                        <Input id="title" placeholder="e.g., Q3 Policy Committee" />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Date</Label>
                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description / Agenda</Label>
                        <Textarea id="description" placeholder="List the main topics and goals for this meeting." />
                    </div>
                    <Button>Schedule Meeting</Button>
                </form>
            </CardContent>
        </Card>
    )
}

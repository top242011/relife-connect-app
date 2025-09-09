
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { NewMeetingForm } from "./new-meeting-form";


export function MeetingScheduler() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Schedule a New Meeting</CardTitle>
                <CardDescription>Use the form below to create a new meeting record and notify attendees.</CardDescription>
            </CardHeader>
            <CardContent>
                <NewMeetingForm>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Meeting
                    </Button>
                </NewMeetingForm>
            </CardContent>
        </Card>
    )
}
